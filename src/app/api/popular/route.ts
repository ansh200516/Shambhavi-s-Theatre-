import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'movie' // movie or tv
  const page = searchParams.get('page') || '1'
  const apiKey = process.env.TMDB_API_KEY

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/${type}/popular`, {
      params: {
        api_key: apiKey,
        page,
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching popular content' }, { status: 500 })
  }
}
