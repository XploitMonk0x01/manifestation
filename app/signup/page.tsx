'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const ParticlesBg = dynamic(() => import('@/components/ParticlesBg'), {
  ssr: false,
})

export default function Signup() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      // Auto sign in after signup
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      router.push('/wishlist')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/wishlist' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: '#0B1121' }}
    >
      <ParticlesBg />

      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 6,
          maxWidth: 440,
          mx: 'auto',
          background: 'rgba(30, 27, 75, 0.85)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Create Your Cosmic Account ✨
          </Typography>
          <Typography variant="subtitle1" color="white" fontWeight={500}>
            Join and manifest your wishes to the universe
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          {error && (
            <Box mb={2}>
              <Typography
                color="error"
                align="center"
                sx={{
                  bgcolor: 'rgba(244,67,54,0.08)',
                  borderRadius: 2,
                  p: 1,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
            InputProps={{
              style: {
                color: 'white',
                background: 'rgba(255,255,255,0.07)',
              },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
          />
          <TextField
            label="Email Address"
            name="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            InputProps={{
              style: {
                color: 'white',
                background: 'rgba(255,255,255,0.07)',
              },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
          />
          <TextField
            label="Password"
            name="password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            InputProps={{
              style: {
                color: 'white',
                background: 'rgba(255,255,255,0.07)',
              },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            InputProps={{
              style: {
                color: 'white',
                background: 'rgba(255,255,255,0.07)',
              },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              py: 1.5,
              fontWeight: 700,
              fontSize: 18,
              background: 'linear-gradient(90deg, #f472b6, #a78bfa, #fde68a)',
              color: '#fff',
              boxShadow: '0 4px 20px 0 rgba(168,139,250,0.25)',
              mb: 2,
              mt: 1,
              '&:hover': {
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)',
              },
            }}
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={22} color="inherit" />
            }
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          <Divider sx={{ my: 3, color: 'white', opacity: 0.2 }}>or</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              color: '#fff',
              borderColor: '#a78bfa',
              background: 'rgba(255,255,255,0.04)',
              fontWeight: 600,
              '&:hover': { background: 'rgba(168,139,250,0.08)' },
            }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </form>
        <Box mt={4} textAlign="center">
          <Typography color="white" fontSize={15}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#fde68a', fontWeight: 600 }}>
              Sign in
            </a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
