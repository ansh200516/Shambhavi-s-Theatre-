import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const ANILIST_API_URL = 'https://graphql.anilist.co'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const moviesPage = parseInt(searchParams.get('moviesPage') || '1')
  const seriesPage = parseInt(searchParams.get('seriesPage') || '1')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  const movieQuery = `
    query ($search: String, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $search, type: ANIME, format: MOVIE) {
          id
          idMal
          title {
            romaji
            english
          }
          description
          coverImage {
            large
            medium
          }
          bannerImage
          startDate {
            year
          }
          averageScore
          episodes
          format
        }
      }
    }
  `

  const seriesQuery = `
    query ($search: String, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
        }
        media(search: $search, type: ANIME, format_in: [TV, TV_SHORT, OVA, ONA, SPECIAL]) {
          id
          idMal
          title {
            romaji
            english
          }
          description
          coverImage {
            large
            medium
          }
          bannerImage
          startDate {
            year
          }
          averageScore
          episodes
          format
        }
      }
    }
  `

  try {
    const [moviesRes, seriesRes] = await Promise.all([
      axios.post(ANILIST_API_URL, {
        query: movieQuery,
        variables: { search: query, page: moviesPage },
      }),
      axios.post(ANILIST_API_URL, {
        query: seriesQuery,
        variables: { search: query, page: seriesPage },
      }),
    ])

    return NextResponse.json({
      movies: moviesRes.data.data.Page,
      series: seriesRes.data.data.Page,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching anime' }, { status: 500 })
  }
}
