'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, LogOut, ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUsername = localStorage.getItem('username')

    if (!token) {
      router.push('/login')
      return
    }

    if (storedUsername) {
      setUsername(storedUsername)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect"
      >
        <div className="content-container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-accent hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <h1 className="text-xl md:text-2xl font-light text-gradient">Shambhavi's Theatre</h1>

          <div className="w-24" />
        </div>
      </motion.header>

      {/* Content */}
      <div className="pt-32 pb-20">
        <div className="content-container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect p-8 md:p-12 rounded-2xl"
          >
            {/* Profile Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-surface-light flex items-center justify-center">
                <User className="w-12 h-12 text-accent" />
              </div>
            </div>

            {/* Username */}
            <h2 className="text-3xl font-light text-center mb-2">{username}</h2>
            <p className="text-accent-muted text-center mb-8">Premium Member</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-surface p-4 rounded-lg text-center"
              >
                <div className="text-2xl font-light mb-1">0</div>
                <div className="text-xs text-accent-muted">Watched</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-surface p-4 rounded-lg text-center"
              >
                <div className="text-2xl font-light mb-1">0</div>
                <div className="text-xs text-accent-muted">Watching</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-surface p-4 rounded-lg text-center"
              >
                <div className="text-2xl font-light mb-1">0</div>
                <div className="text-xs text-accent-muted">Favorites</div>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-4 rounded-lg font-medium overflow-hidden group text-white shadow-lg"
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
                  <span className="relative z-10">Continue Watching</span>
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="relative w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg font-medium transition-all text-red-400 flex items-center justify-center gap-2 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-red-500/20"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <LogOut className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Sign Out</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
