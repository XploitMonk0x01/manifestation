'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import WishCard from '../../components/WishCard'
// import ParticlesBg from '../../components/ParticlesBg'
import dynamic from 'next/dynamic'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { AutoAwesome as SparkleIcon } from '@mui/icons-material'
const ParticlesBg = dynamic(() => import('../../components/ParticlesBg'), {
  ssr: false,
})

export default function Wishlist() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchWishes = async () => {
        try {
          const res = await fetch('/api/wishes', { cache: 'no-store' })
          if (!res.ok) {
            const text = await res.text()
            setError(`Failed to fetch wishes: ${text}`)
            if (res.status === 401) router.push('/login')
            return
          }
          const data = await res.json()
          setWishes(data)
        } catch (err) {
          setError('An unexpected error occurred')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchWishes()
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)' }}
      >
        <CircularProgress size={40} sx={{ color: '#a78bfa' }} />
        <Typography variant="h6" color="#e0e7ff" ml={2}>
          Gathering Stardust...
        </Typography>
      </Box>
    )
  }

  if (!session) return null

  const sendWish = async () => {
    if (!wish.trim()) return
    setIsSending(true)
    setError('')
    setSuccessMessage('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: wish, isPublic }),
      })
      if (res.ok) {
        const createdWish = await res.json()
        setWishes((prevWishes) => [...prevWishes, createdWish])
        setWish('')
        setSuccessMessage('Your wish has been sent to the stars! ✨')
        setTimeout(() => setSuccessMessage(''), 5000)
      } else {
        const text = await res.text()
        setError(`Failed to add wish: ${text}`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Box
      minHeight={{ xs: '100vh', md: '100vh' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)',
        pt: { xs: 6, md: 10 },
        pb: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 0 },
        position: 'relative',
      }}
      flexDirection="column"
    >
      <ParticlesBg />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ width: '100%' }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          align="center"
          sx={{
            mb: 6,
            background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 2,
            textShadow: '0 2px 16px #a78bfa55',
          }}
        >
          Whisper to the Cosmos
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ width: '100%', maxWidth: 520, zIndex: 2 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(30, 27, 75, 0.85)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255,255,255,0.10)',
            mb: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <SparkleIcon sx={{ color: '#fde68a', fontSize: 32 }} />
            <Typography variant="h6" fontWeight={600} color="#e0e7ff">
              Send a Wish
            </Typography>
          </Stack>
          <TextField
            multiline
            minRows={4}
            maxRows={8}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            fullWidth
            placeholder="Speak your wish..."
            variant="outlined"
            InputProps={{
              style: {
                color: 'white',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 12,
              },
            }}
            InputLabelProps={{ style: { color: '#a78bfa' } }}
            disabled={isSending}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(_, checked) => setIsPublic(checked)}
                color="secondary"
                sx={{ ml: 1 }}
              />
            }
            label={
              <Typography color="#a78bfa">Make this wish public</Typography>
            }
            sx={{ mt: 2, mb: 1, userSelect: 'none' }}
          />
          <Button
            onClick={sendWish}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: 18,
              background: 'linear-gradient(90deg, #f472b6, #a78bfa, #38bdf8)',
              color: '#fff',
              boxShadow: '0 4px 20px 0 rgba(168,139,250,0.25)',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
              },
              opacity: isSending ? 0.6 : 1,
            }}
            disabled={isSending || !wish.trim()}
            startIcon={
              isSending ? <CircularProgress size={22} color="inherit" /> : null
            }
          >
            {isSending ? 'Sending...' : 'Send to the Stars'}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2, fontWeight: 500 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert
              severity="success"
              sx={{
                mt: 2,
                fontWeight: 500,
                background: 'rgba(168,139,250,0.10)',
              }}
            >
              {successMessage}
            </Alert>
          )}
        </Paper>
      </motion.div>
      <Box
        mt={{ xs: 4, md: 6 }}
        width="100%"
        maxWidth={900}
        px={{ xs: 1, sm: 2, md: 0 }}
      >
        <Stack spacing={3}>
          {wishes.map((w) => (
            <WishCard key={w._id} text={w.text} date={w.date} user={w.user} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
