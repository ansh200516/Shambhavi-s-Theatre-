import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'movie' // movie or tv
  const apiKey = process.env.TMDB_API_KEY

  try {
    // Fetch trending content (day)
    const response = await axios.get(`https://api.themoviedb.org/3/trending/${type}/day`, {
      params: {
        api_key: apiKey,
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching trending content' }, { status: 500 })
  }
}
