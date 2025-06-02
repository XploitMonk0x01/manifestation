'use client'
import { motion } from 'framer-motion'

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-space via-cosmic-purple to-nebula-blue flex flex-col items-center justify-center text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-5xl md:text-6xl text-starlight font-orbitron mb-6 text-glow-starlight"
      >
        Cast Your Wishes to the Cosmos
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
        className="text-lg md:text-xl text-starlight/80 font-orbitron mb-8 max-w-2xl"
      >
        A sanctuary for your hopes, dreams, and desires. Send your messages out
        into the universe and let the starlight carry them.
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
        className="text-md text-starlight/60 font-orbitron"
      >
        Login or Sign Up to begin your journey.
      </motion.p>
    </div>
  )
}
