'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Play, Star } from 'lucide-react'
import { cn, getImageUrl } from '@/lib/utils'

interface ContentCardProps {
  id: number
  title: string
  posterPath: string | null
  rating?: number
  year?: string
  type: 'movie' | 'tv' | 'anime'
  malId?: number // For anime
  format?: string // For anime (MOVIE or TV)
  onClick?: () => void
  className?: string
}

export default function ContentCard({
  id,
  title,
  posterPath,
  rating,
  year,
  type,
  malId,
  format,
  onClick,
  className,
}: ContentCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
      return
    }

    // Navigate based on content type
    if (type === 'movie') {
      // Direct to watch page for movies
      router.push(`/watch?type=movie&id=${id}`)
    } else if (type === 'tv') {
      // Go to seasons page for TV shows
      router.push(`/seasons/${id}`)
    } else if (type === 'anime') {
      // For anime, check format
      if (format === 'MOVIE') {
        router.push(`/watch?type=anime-movie&id=${id}&mal=${malId || id}`)
      } else {
        // Go to anime episodes page
        router.push(`/anime/${id}?mal=${malId || id}`)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={cn(
        'relative flex-shrink-0 w-40 md:w-48 lg:w-56 cursor-pointer group',
        className
      )}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface-light">
        <Image
          src={type === 'anime' ? posterPath || '/placeholder.svg' : getImageUrl(posterPath)}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={type === 'anime'}
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent flex items-end justify-center p-4"
            >
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ delay: 0.1 }}
                className="w-14 h-14 rounded-full backdrop-blur-sm flex items-center justify-center shadow-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #dc143c 0%, #e11d48 50%, #fb7185 100%)'
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b8a 0%, #dc143c 50%, #be123c 100%)'
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <Play className="w-6 h-6 text-white fill-current ml-0.5 relative z-10" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rating badge */}
        {typeof rating === 'number' && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0.8 }}
        className="mt-3 space-y-1"
      >
        <h4 className="text-sm md:text-base font-medium line-clamp-2 leading-tight">
          {title}
        </h4>
        {year && (
          <p className="text-xs text-accent-muted">
            {year}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
