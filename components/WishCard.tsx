'use client'

import { motion } from 'framer-motion'
import React from 'react'; // Import React

interface WishCardProps {
  text: string
  date: string | Date
}

function WishCard({ text, date }: WishCardProps) { // Changed to a named function
  const formatDate = (dateInput: string | Date): string => {
    const d = new Date(dateInput)
    return `Sent on: ${d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} - ${d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="p-6 glass-effect rounded-xl text-starlight shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-500/20"
    >
      <p className="text-lg md:text-xl font-medium">{text}</p>
      <p className="text-xs text-starlight/70 mt-2">{formatDate(date)}</p>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-cosmic-purple to-nebula-blue rounded-full"></div>
    </motion.div>
  )
}

export default React.memo(WishCard); // Wrap with React.memo
