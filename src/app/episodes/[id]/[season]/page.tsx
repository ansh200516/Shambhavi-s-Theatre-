'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { ArrowLeft, Play } from 'lucide-react'
import Image from 'next/image'
import type { Episode } from '@/types'

export default function EpisodesPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const season = params.season as string
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [seasonName, setSeasonName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id && season) {
      fetchEpisodes()
    }
  }, [id, season])

  const fetchEpisodes = async () => {
    try {
      const response = await fetch(`/api/episodes?id=${id}&season=${season}`)
      const data = await response.json()
      setSeasonName(data.name || `Season ${season}`)
      setEpisodes(data.episodes || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching episodes:', error)
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
            <span>Back to Seasons</span>
          </motion.button>

          {/* Season Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light mb-2">{seasonName}</h1>
            <p className="text-xl text-accent-muted">{episodes.length} Episodes</p>
          </motion.div>

          {/* Episodes List */}
          <div className="space-y-4">
            {episodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.01, x: 5 }}
                onClick={() =>
                  router.push(`/watch?type=tv&id=${id}&season=${season}&episode=${episode.episode_number}`)
                }
                className="bg-surface-light rounded-lg overflow-hidden cursor-pointer border border-primary/10 hover:border-primary/30 transition-all group flex flex-col md:flex-row"
              >
                {/* Episode Thumbnail */}
                <div className="relative w-full md:w-80 aspect-video bg-surface flex-shrink-0">
                  {episode.still_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                      alt={episode.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-accent-muted">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{
                        background: 'linear-gradient(135deg, #dc143c 0%, #e11d48 50%, #fb7185 100%)'
                      }}
                    >
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </motion.div>
                  </div>
                </div>

                {/* Episode Info */}
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-medium flex-1">
                      {episode.episode_number}. {episode.name}
                    </h3>
                    {episode.air_date && (
                      <span className="text-sm text-accent-muted ml-4">{episode.air_date}</span>
                    )}
                  </div>
                  {episode.overview && (
                    <p className="text-accent-muted line-clamp-2 md:line-clamp-3">{episode.overview}</p>
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
