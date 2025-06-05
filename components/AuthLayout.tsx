'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="min-h-screen bg-[#0B1121]" />
  }
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#0B1121]">
      <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-purple/20 to-nebula-blue/20" />

      <div className="relative w-full max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          suppressHydrationWarning
          className="w-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
