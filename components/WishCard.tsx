'use client'

import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { AutoAwesome as SparkleIcon } from '@mui/icons-material'
import { motion } from 'framer-motion'

interface WishCardProps {
  text: string
  date: string | Date
  user?: {
    name?: string
    image?: string
  }
}

function WishCard({ text, date, user }: WishCardProps) {
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
      transition={{ duration: 1.1, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      <Card
        elevation={8}
        sx={{
          borderRadius: 4,
          background:
            'linear-gradient(135deg, #a78bfa 0%, #f472b6 60%, #38bdf8 100%)',
          color: 'white',
          boxShadow: '0 4px 24px 0 rgba(168,139,250,0.18)',
          border: '1px solid rgba(255,255,255,0.10)',
          mb: 2,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <SparkleIcon sx={{ color: '#fde68a', fontSize: 28 }} />
            {user?.image && (
              <Box
                component="img"
                src={user.image}
                alt={user.name || 'User'}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 8px #a78bfa55',
                  mr: 1,
                }}
              />
            )}
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ flex: 1, color: 'white' }}
            >
              {text}
            </Typography>
          </Box>
          {user?.name && (
            <Typography
              variant="subtitle2"
              sx={{ color: '#f472b6', fontWeight: 500 }}
            >
              {user.name}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: '#e0e7ff', opacity: 0.8 }}>
            {formatDate(date)}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default React.memo(WishCard)
