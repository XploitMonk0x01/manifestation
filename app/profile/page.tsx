'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ProfileForm from '../../components/ProfileForm'
import { motion } from 'framer-motion'
import ParticlesBg from '../../components/ParticlesBg'
import { Paper, Box } from '@mui/material'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <p className="text-starlight text-center mt-20">
        Summoning Your Essence...
      </p>
    )
  }

  if (!session) return null

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: '#0B1121',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <ParticlesBg />
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4, md: 6 },
          borderRadius: { xs: 3, md: 6 },
          maxWidth: 520,
          width: '100%',
          mx: 'auto',
          background: 'rgba(30, 27, 75, 0.85)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative glass-effect p-8 rounded-2xl max-w-md w-full border border-nebula-blue/30"
        >
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-nebula-blue opacity-20"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <h2 className="text-3xl md:text-4xl font-bold text-starlight mb-6 text-center relative z-10 tracking-wide">
            Your Celestial Identity
          </h2>
          <ProfileForm setError={setError} setSuccess={setSuccess} />
          {error && (
            <p className="text-red-400 text-sm mt-4 text-center relative z-10">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-400 text-sm mt-4 text-center relative z-10">
              {success}
            </p>
          )}
        </motion.div>
      </Paper>
    </Box>
  )
}
