'use client'

import { motion } from 'framer-motion'

export default function WishCard({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="p-6 glass-effect rounded-xl text-starlight shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-500/20"
    >
      <p className="text-lg md:text-xl font-medium">{text}</p>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-purple-500 to-nebula-blue rounded-full"></div>
    </motion.div>
  )
}
