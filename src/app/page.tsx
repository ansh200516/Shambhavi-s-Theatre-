'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ContentRow from '@/components/ContentRow'
import ContentCard from '@/components/ContentCard'
import type { Movie, TVShow, Anime } from '@/types'

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [trendingSeries, setTrendingSeries] = useState<TVShow[]>([])
  const [featuredContent, setFeaturedContent] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Fetch trending movies (latest and popular)
      const [trendingRes, popularRes, nowPlayingRes, tvRes] = await Promise.all([
        fetch('/api/trending?type=movie'),
        fetch('/api/popular?type=movie'),
        fetch('/api/now-playing'),
        fetch('/api/popular?type=tv'),
      ])

      const [trendingData, popularData, nowPlayingData, tvData] = await Promise.all([
        trendingRes.json(),
        popularRes.json(),
        nowPlayingRes.json(),
        tvRes.json(),
      ])

      // Combine trending and popular, prioritize recent movies
      const allMovies = [
        ...(nowPlayingData.results || []).slice(0, 10),
        ...(trendingData.results || []).slice(0, 10),
        ...(popularData.results || []).slice(0, 10),
      ]

      // Remove duplicates
      const uniqueMovies = Array.from(
        new Map(allMovies.map((movie: Movie) => [movie.id, movie])).values()
      ).slice(0, 20)

      setTrendingMovies(uniqueMovies as Movie[])

      // Set first movie with backdrop as featured
      if (uniqueMovies.length > 0) {
        const featured = uniqueMovies.find((m: Movie) => m.backdrop_path) || uniqueMovies[0]
        setFeaturedContent(featured as Movie)
      }

      // Fetch popular TV series
      setTrendingSeries(tvData.results?.slice(0, 20) || [])

      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching content:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <main className="min-h-screen relative">
      <Header />

      {/* Hero Section */}
      {featuredContent && (
        <Hero
          title={featuredContent.title}
          overview={featuredContent.overview}
          backdropPath={`https://image.tmdb.org/t/p/original${featuredContent.backdrop_path}`}
          onPlay={() => {
            if (featuredContent) {
              window.location.href = `/watch?type=movie&id=${featuredContent.id}`
            }
          }}
          onInfo={() => {
            // Could open a modal with more details
            console.log('More info about:', featuredContent)
          }}
        />
      )}

      {/* Content Rows */}
      <div className="relative -mt-32 z-10 space-y-8 md:space-y-12 pb-20">
        {trendingMovies.length > 0 && (
          <ContentRow title="Latest Movies">
            {trendingMovies.map((movie) => (
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
          </ContentRow>
        )}

        {trendingSeries.length > 0 && (
          <ContentRow title="Popular Series">
            {trendingSeries.map((series) => (
              <ContentCard
                key={series.id}
                id={series.id}
                title={series.name}
                posterPath={series.poster_path}
                rating={series.vote_average}
                year={series.first_air_date?.split('-')[0]}
                type="tv"
              />
            ))}
          </ContentRow>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="content-container py-12 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-accent-muted"
          >
            © 2025 Shambhavi's Theatre. A premium streaming experience.
          </motion.p>
        </div>
      </footer>
    </main>
  )
}
