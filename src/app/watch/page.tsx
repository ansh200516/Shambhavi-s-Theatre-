'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'

function WatchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [serverIndex, setServerIndex] = useState(0)

  const type = searchParams.get('type')
  const id = searchParams.get('id')
  const season = searchParams.get('season')
  const episode = searchParams.get('episode')
  const malId = searchParams.get('mal')
  const ep = searchParams.get('ep') // For anime episodes

  const getServers = () => {
    if (type === 'movie') {
      return [
        {
          name: 'Xprime',
          url: `https://xprime.tv/watch/${id}`,
        },
        {
          name: 'VidSrc',
          url: `https://vidsrc.cc/v2/embed/movie/${id}`,
        },
        {
          name: '2Embed',
          url: `https://www.2embed.cc/embed/${id}`,
        },
        {
          name: 'RiveStream',
          url: `https://rivestream.live/watch?type=movie&id=${id}`,
        },
      ]
    } else if (type === 'tv') {
      return [
        {
          name: 'Xprime',
          url: `https://xprime.tv/watch/${id}/${season}/${episode}`,
        },
        {
          name: 'VidSrc',
          url: `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`,
        },
        {
          name: '2Embed',
          url: `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
        },
        {
          name: 'RiveStream',
          url: `https://rivestream.live/watch?type=tv&id=${id}&season=${season}&episode=${episode}`,
        },
      ]
    } else if (type === 'anime-movie') {
      return [
        {
          name: 'VidSrc',
          url: `https://vidsrc.cc/v2/embed/movie/${malId || id}`,
        },
        {
          name: '2Anime',
          url: `https://2anime.xyz/embed/${malId || id}`,
        },
      ]
    } else if (type === 'anime-series') {
      return [
        {
          name: 'VidSrc',
          url: `https://vidsrc.cc/v2/embed/tv/${malId || id}/1/${ep}`,
        },
        {
          name: '2Anime',
          url: `https://2anime.xyz/embed/${malId || id}/${ep}`,
        },
      ]
    }
    return []
  }

  const servers = getServers()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect"
      >
        <div className="content-container py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-accent hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <Link href="/">
            <h1 className="text-xl md:text-2xl font-light text-gradient">
              Shambhavi's Theatre
            </h1>
          </Link>

          <button className="p-2 rounded-full hover:bg-surface-light transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </motion.header>

      {/* Player */}
      <div className="pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="content-container"
        >
          <div className="aspect-video bg-surface rounded-lg overflow-hidden">
            <iframe
              src={servers[serverIndex].url}
              className="w-full h-full"
              sandbox="allow-scripts allow-same-origin"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Server Selection */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex gap-3"
          >
            {servers.map((server, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setServerIndex(index)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  serverIndex === index
                    ? 'text-white shadow-lg'
                    : 'bg-surface-light text-accent hover:bg-surface'
                }`}
                style={
                  serverIndex === index
                    ? { background: 'linear-gradient(135deg, #dc143c 0%, #e11d48 50%, #fb7185 100%)' }
                    : {}
                }
              >
                {server.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    }>
      <WatchContent />
    </Suspense>
  )
}
