import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'
  const apiKey = process.env.TMDB_API_KEY

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: apiKey,
        query,
        page,
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching movies' }, { status: 500 })
  }
}
