'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import AuthLayout from '@/components/AuthLayout'
import Link from 'next/link'
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/wishlist')
      }
    } catch (err) {
      setError('An unexpected error occurred')
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
      sx={{
        background: '#0B1121',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
      <Paper
        elevation={10}
        className={inter.className}
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
            Manifest Your Dreams ✨
          </Typography>
          <Typography variant="subtitle1" color="white" fontWeight={500}>
            Sign in to send your wishes to the universe
          </Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          {error && (
            <Box mb={2}>
              <Typography
                color="error"
                align="center"
                sx={{ bgcolor: 'rgba(244,67,54,0.08)', borderRadius: 2, p: 1 }}
              >
                {error}
              </Typography>
            </Box>
          )}
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            autoComplete="email"
            required
            InputProps={{
              style: { color: 'white', background: 'rgba(255,255,255,0.07)' },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            autoComplete="current-password"
            required
            InputProps={{
              style: { color: 'white', background: 'rgba(255,255,255,0.07)' },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
            mb={2}
          >
            <FormControlLabel
              control={<Checkbox sx={{ color: '#a78bfa' }} />}
              label={
                <Typography color="white" fontSize={14}>
                  Remember me
                </Typography>
              }
            />
            <Link
              href="/forgot-password"
              style={{ color: '#f472b6', fontWeight: 500, fontSize: 14 }}
            >
              Forgot password?
            </Link>
          </Box>
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
            {isLoading ? 'Manifesting...' : 'Sign in'}
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
            onClick={() => signIn('google', { callbackUrl: '/wishlist' })}
          >
            Continue with Google
          </Button>
        </form>
        <Box mt={4} textAlign="center">
          <Typography color="white" fontSize={15}>
            New to Manifestation?{' '}
            <Link href="/signup" style={{ color: '#fde68a', fontWeight: 600 }}>
              Create your cosmic account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
