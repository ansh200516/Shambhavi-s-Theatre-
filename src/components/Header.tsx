'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Search, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0.8, 1])
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <motion.header
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled ? 'bg-background/95 backdrop-blur-xl border-b border-primary/20' : 'bg-transparent'
        )}
      >
        <nav className="content-container py-4 md:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-2xl md:text-3xl font-light tracking-tight cursor-pointer relative"
              >
                <span className="bg-gradient-to-r from-white via-crimson-400 to-crimson-500 bg-clip-text text-transparent">
                  Shambhavi's Theatre
                </span>
              </motion.h1>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="relative p-3 rounded-full hover:bg-primary/10 transition-all duration-300 group"
              >
                <motion.div
                  animate={{ rotate: isSearchOpen ? 90 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {isSearchOpen ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <Search className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* User Menu */}
              <Link href="/profile">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-3 rounded-full hover:bg-primary/10 transition-all duration-300 group"
                >
                  <User className="w-5 h-5 text-white" />
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/20"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Full Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 backdrop-blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(10,5,6,0.97) 0%, rgba(18,6,9,0.97) 50%, rgba(26,10,14,0.95) 100%)'
            }}
            onClick={() => setIsSearchOpen(false)}
          >
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl"
              >
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies, series, anime..."
                      autoFocus
                      className="w-full px-8 py-6 text-2xl md:text-3xl bg-surface-light/50 border-2 border-primary/20 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-white placeholder:text-white/40 backdrop-blur-sm"
                    />
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <button
                        type="submit"
                        className="p-3 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                      >
                        <Search className="w-6 h-6 text-white" />
                      </button>
                    </motion.div>
                  </div>
                </form>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 text-center text-white/50 text-sm"
                >
                  Press Enter to search or Esc to close
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
