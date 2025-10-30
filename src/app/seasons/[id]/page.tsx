'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import type { Season } from '@/types'

export default function SeasonsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [seasons, setSeasons] = useState<Season[]>([])
  const [showName, setShowName] = useState('')
  const [posterPath, setPosterPath] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchSeasons()
    }
  }, [id])

  const fetchSeasons = async () => {
    try {
      const response = await fetch(`/api/seasons?id=${id}`)
      const data = await response.json()
      setShowName(data.name || '')
      setPosterPath(data.poster_path || '')
      setSeasons(data.seasons || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching seasons:', error)
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
    <main className="min-h-screen">
      <Header />

      <div className="pt-32 pb-20">
        <div className="content-container">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent-muted hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          {/* Show Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-8 mb-12"
          >
            {posterPath && (
              <div className="flex-shrink-0 w-48 md:w-64">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                  alt={showName}
                  width={256}
                  height={384}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-light mb-4">{showName}</h1>
              <p className="text-xl text-accent-muted">Select a season to watch</p>
            </div>
          </motion.div>

          {/* Seasons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {seasons.map((season, index) => (
              <motion.div
                key={season.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => router.push(`/episodes/${id}/${season.season_number}`)}
                className="bg-surface-light rounded-lg overflow-hidden cursor-pointer border border-primary/10 hover:border-primary/30 transition-all group"
              >
                <div className="relative aspect-video bg-surface">
                  {season.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                      alt={season.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent-muted">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{season.name}</h3>
                  <p className="text-sm text-accent-muted mb-2">
                    {season.episode_count} Episodes
                  </p>
                  {season.overview && (
                    <p className="text-sm text-accent-muted line-clamp-2">{season.overview}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
