'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Info } from 'lucide-react'
import gsap from 'gsap'
import Image from 'next/image'

interface HeroProps {
  title: string
  overview: string
  backdropPath: string
  onPlay?: () => void
  onInfo?: () => void
}

export default function Hero({ title, overview, backdropPath, onPlay, onInfo }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.hero-text'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      )
    }
  }, [])

  return (
    <motion.section
      ref={containerRef}
      style={{ y, opacity }}
      className="relative h-[85vh] md:h-[90vh] flex items-end pb-24 md:pb-32"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        {backdropPath && (
          <Image
            src={backdropPath}
            alt={title}
            fill
            priority
            className="object-cover"
            quality={90}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="content-container">
        <div className="max-w-3xl space-y-6">
          <motion.h2
            className="hero-text text-5xl md:text-7xl lg:text-8xl font-light tracking-tight"
            initial={{ opacity: 0 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="hero-text text-base md:text-lg text-accent max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
          >
            {overview}
          </motion.p>

          <motion.div
            className="hero-text flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlay}
              className="relative flex items-center gap-3 px-10 py-4 rounded-full font-medium overflow-hidden group text-white shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #dc143c 0%, #e11d48 50%, #fb7185 100%)'
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #ff6b8a 0%, #dc143c 50%, #be123c 100%)'
                }}
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <Play className="w-5 h-5 fill-current relative z-10" />
              <span className="relative z-10">Play Now</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInfo}
              className="relative flex items-center gap-3 px-10 py-4 bg-primary/10 backdrop-blur-md text-white rounded-full font-medium border border-primary/30 overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-primary/20"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <Info className="w-5 h-5 relative z-10" />
              <span className="relative z-10">More Info</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
