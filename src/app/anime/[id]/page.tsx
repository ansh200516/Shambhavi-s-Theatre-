'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import { ArrowLeft, Play } from 'lucide-react'

function AnimeEpisodesContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const malId = searchParams.get('mal') || id
  const [episodes, setEpisodes] = useState<number>(0)
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      // For anime, we typically just show a list of episode numbers
      // The actual episode count would come from AniList API
      // For now, we'll default to 24 episodes (typical anime season)
      setEpisodes(24)
      setTitle('Anime Series')
      setIsLoading(false)
    }
  }, [id])

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

          {/* Anime Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light mb-2">{title}</h1>
            <p className="text-xl text-accent-muted">Select an episode to watch</p>
          </motion.div>

          {/* Episodes Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
            {Array.from({ length: episodes }, (_, i) => i + 1).map((ep, index) => (
              <motion.div
                key={ep}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() =>
                  router.push(`/watch?type=anime-series&id=${id}&mal=${malId}&ep=${ep}`)
                }
                className="aspect-square rounded-lg flex items-center justify-center cursor-pointer border border-primary/20 hover:border-primary/50 transition-all relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(220,20,60,0.1) 0%, rgba(225,29,72,0.1) 100%)'
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10 text-center">
                  <span className="text-2xl font-light">{ep}</span>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 mx-auto text-primary fill-current" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function AnimeEpisodesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      }
    >
      <AnimeEpisodesContent />
    </Suspense>
  )
}
