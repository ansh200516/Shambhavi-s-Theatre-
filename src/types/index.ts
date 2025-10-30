export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids?: number[]
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  genre_ids?: number[]
}

export interface Anime {
  id: number
  idMal?: number
  title: {
    romaji: string
    english?: string
  }
  description?: string
  coverImage: {
    large?: string
    medium?: string
  }
  bannerImage?: string
  startDate?: {
    year?: number
  }
  averageScore?: number
  episodes?: number
  format?: string
}

export interface Season {
  id: number
  season_number: number
  name: string
  overview: string
  poster_path: string | null
  episode_count: number
  air_date: string
}

export interface Episode {
  id: number
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
}

export interface WatchedItem {
  user_id: number
  item_type: 'tmdb-movie' | 'tmdb-tv' | 'anime-movie' | 'anime-series'
  item_id: string
  season_number?: number
  episode_number?: number
  state: 'not_watched' | 'watching' | 'watched'
  updated_at: Date
}

export interface User {
  id: number
  email: string
  username: string
  created_at: Date
}

export type ContentType = 'movie' | 'tv' | 'anime'
