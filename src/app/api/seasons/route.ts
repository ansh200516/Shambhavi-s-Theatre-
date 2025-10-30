import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id')
  const apiKey = process.env.TMDB_API_KEY

  if (!id) {
    return NextResponse.json({ error: 'ID parameter required' }, { status: 400 })
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${id}`, {
      params: {
        api_key: apiKey,
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching seasons' }, { status: 500 })
  }
}
