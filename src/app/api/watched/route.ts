import { NextRequest, NextResponse } from 'next/server'
import { getDbPool } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import axios from 'axios'

const ANILIST_API_URL = 'https://graphql.anilist.co'

async function fetchFromAniList(itemId: string) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        idMal
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        seasonYear
      }
    }
  `
  const response = await axios.post(ANILIST_API_URL, {
    query,
    variables: { id: parseInt(itemId, 10) },
  })
  const media = response.data.data.Media
  return {
    id: media.id,
    mal_id: media.idMal,
    title: media.title,
    coverImage: media.coverImage,
    seasonYear: media.seasonYear,
  }
}

async function fetchFromTMDB(itemId: string, type: string) {
  const endpoint =
    type === 'tmdb-movie'
      ? `https://api.themoviedb.org/3/movie/${itemId}`
      : `https://api.themoviedb.org/3/tv/${itemId}`

  const response = await axios.get(endpoint, {
    params: {
      api_key: process.env.TMDB_API_KEY,
    },
  })

  const data = response.data
  return {
    id: data.id,
    title: data.title || data.name,
    poster_path: data.poster_path,
    release_date: data.release_date || data.first_air_date,
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const pool = getDbPool()

  // Continue watching
  if (searchParams.get('continue') === '1') {
    try {
      const queries = [
        pool.query(
          `SELECT item_id FROM (
            SELECT DISTINCT ON (item_id) * FROM watched
            WHERE user_id = $1 AND item_type = 'tmdb-movie' AND state = 'watching'
            ORDER BY item_id, updated_at DESC
          ) AS sub ORDER BY updated_at DESC LIMIT 5`,
          [userId]
        ),
        pool.query(
          `SELECT item_id FROM (
            SELECT DISTINCT ON (item_id) * FROM watched
            WHERE user_id = $1 AND item_type = 'tmdb-tv' AND state = 'watching'
            ORDER BY item_id, updated_at DESC
          ) AS sub ORDER BY updated_at DESC LIMIT 5`,
          [userId]
        ),
        pool.query(
          `SELECT item_id FROM (
            SELECT DISTINCT ON (item_id) * FROM watched
            WHERE user_id = $1 AND item_type = 'anime-movie' AND state = 'watching'
            ORDER BY item_id, updated_at DESC
          ) AS sub ORDER BY updated_at DESC LIMIT 5`,
          [userId]
        ),
        pool.query(
          `SELECT item_id FROM (
            SELECT DISTINCT ON (item_id) * FROM watched
            WHERE user_id = $1 AND item_type = 'anime-series' AND state = 'watching'
            ORDER BY item_id, updated_at DESC
          ) AS sub ORDER BY updated_at DESC LIMIT 5`,
          [userId]
        ),
      ]

      const [moviesRows, seriesRows, animeMoviesRows, animeSeriesRows] = await Promise.all(queries)

      const [moviesWithDetails, seriesWithDetails, animeMoviesWithDetails, animeSeriesWithDetails] =
        await Promise.all([
          Promise.all(
            moviesRows.rows.map(async (row: any) => {
              const details = await fetchFromTMDB(row.item_id, 'tmdb-movie')
              return { ...row, ...details }
            })
          ),
          Promise.all(
            seriesRows.rows.map(async (row: any) => {
              const details = await fetchFromTMDB(row.item_id, 'tmdb-tv')
              return { ...row, ...details }
            })
          ),
          Promise.all(
            animeMoviesRows.rows.map(async (row: any) => {
              const details = await fetchFromAniList(row.item_id)
              return { ...row, ...details }
            })
          ),
          Promise.all(
            animeSeriesRows.rows.map(async (row: any) => {
              const details = await fetchFromAniList(row.item_id)
              return { ...row, ...details }
            })
          ),
        ])

      return NextResponse.json({
        ok: true,
        movies: moviesWithDetails,
        series: seriesWithDetails,
        animeMovies: animeMoviesWithDetails,
        animeSeries: animeSeriesWithDetails,
      })
    } catch (error) {
      return NextResponse.json({ ok: false, error: 'Failed to fetch continue watching' }, { status: 500 })
    }
  }

  // Batch get watched states
  const itemsParam = searchParams.get('items')
  if (itemsParam) {
    try {
      const items = JSON.parse(itemsParam)
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ states: {} })
      }

      const wheres: string[] = []
      const params: any[] = [userId]
      items.forEach((x: any) => {
        const season = x.season_number !== undefined && x.season_number !== null ? x.season_number : 0
        const episode = x.episode_number !== undefined && x.episode_number !== null ? x.episode_number : 0
        const clause = `(item_type=$${params.length + 1} AND item_id=$${params.length + 2} AND season_number=$${
          params.length + 3
        } AND episode_number=$${params.length + 4})`
        params.push(x.item_type, String(x.item_id), season, episode)
        wheres.push(clause)
      })

      const sql = `SELECT * FROM watched WHERE user_id=$1 AND (${wheres.join(' OR ')})`
      const { rows } = await pool.query(sql, params)

      const stateMap: Record<string, string> = {}
      rows.forEach((row: any) => {
        let k = `${row.item_type}:${row.item_id}`
        if (row.season_number !== 0) k += `:s${row.season_number}`
        if (row.episode_number !== 0) k += `:e${row.episode_number}`
        stateMap[k] = row.state
      })

      return NextResponse.json({ states: stateMap })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid items param' }, { status: 400 })
    }
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request)
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { item_type, item_id, season_number, episode_number, state } = body

    if (!item_type || !item_id || state === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const season = season_number !== undefined && season_number !== null ? season_number : 0
    const episode = episode_number !== undefined && episode_number !== null ? episode_number : 0

    const pool = getDbPool()

    if (state === 'not_watched') {
      await pool.query(
        `DELETE FROM watched WHERE user_id=$1 AND item_type=$2 AND item_id=$3 AND season_number=$4 AND episode_number=$5`,
        [userId, item_type, String(item_id), season, episode]
      )
      return NextResponse.json({ ok: true, deleted: true })
    } else {
      const { rows } = await pool.query(
        `INSERT INTO watched (user_id, item_type, item_id, season_number, episode_number, state, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (user_id, item_type, item_id, season_number, episode_number)
         DO UPDATE SET state=$6, updated_at=NOW()
         RETURNING *`,
        [userId, item_type, String(item_id), season, episode, state]
      )
      return NextResponse.json({ ok: true, row: rows[0] })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
