import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BackgroundEffects from '@/components/BackgroundEffects'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Shambhavi's Theatre - Premium Streaming Experience",
  description: 'Experience cinema like never before. A premium, minimalist streaming platform.',
  icons: {
    icon: '/icons/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <BackgroundEffects />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
