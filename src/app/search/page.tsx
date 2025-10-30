'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import ContentCard from '@/components/ContentCard'
import type { Movie, TVShow, Anime } from '@/types'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [movies, setMovies] = useState<Movie[]>([])
  const [series, setSeries] = useState<TVShow[]>([])
  const [anime, setAnime] = useState<Anime[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      fetchSearchResults(query)
    }
  }, [query])

  const fetchSearchResults = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const [moviesRes, seriesRes, animeRes] = await Promise.all([
        fetch(`/api/search/movies?q=${encodeURIComponent(searchQuery)}&page=1`),
        fetch(`/api/search/series?q=${encodeURIComponent(searchQuery)}&page=1`),
        fetch(`/api/search/anime?q=${encodeURIComponent(searchQuery)}`),
      ])

      const [moviesData, seriesData, animeData] = await Promise.all([
        moviesRes.json(),
        seriesRes.json(),
        animeRes.json(),
      ])

      setMovies(moviesData.results?.slice(0, 20) || [])
      setSeries(seriesData.results?.slice(0, 20) || [])
      setAnime([
        ...(animeData.movies?.media || []),
        ...(animeData.series?.media || []),
      ].slice(0, 20))
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const totalResults = movies.length + series.length + anime.length

  return (
    <main className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20">
        <div className="content-container">
          {/* Search Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              Search Results
            </h1>
            <p className="text-accent-muted text-lg">
              {isLoading ? 'Searching...' : `Found ${totalResults} results for "${query}"`}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="space-y-16">
              {/* Movies */}
              {movies.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-light mb-6">Movies ({movies.length})</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie) => (
                      <ContentCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        posterPath={movie.poster_path}
                        rating={movie.vote_average}
                        year={movie.release_date?.split('-')[0]}
                        type="movie"
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* TV Series */}
              {series.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-light mb-6">TV Series ({series.length})</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {series.map((show) => (
                      <ContentCard
                        key={show.id}
                        id={show.id}
                        title={show.name}
                        posterPath={show.poster_path}
                        rating={show.vote_average}
                        year={show.first_air_date?.split('-')[0]}
                        type="tv"
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Anime */}
              {anime.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-light mb-6">Anime ({anime.length})</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {anime.map((item) => (
                      <ContentCard
                        key={item.id}
                        id={item.id}
                        title={item.title.english || item.title.romaji}
                        posterPath={item.coverImage.large || item.coverImage.medium || ''}
                        rating={item.averageScore ? item.averageScore / 10 : undefined}
                        year={item.startDate?.year?.toString()}
                        type="anime"
                        malId={item.idMal}
                        format={item.format}
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* No Results */}
              {totalResults === 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <p className="text-2xl text-accent-muted mb-4">No results found</p>
                  <p className="text-accent-muted">Try searching for something else</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
          />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
