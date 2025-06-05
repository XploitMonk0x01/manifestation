'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material'
import { AutoAwesome as SparkleIcon } from '@mui/icons-material'

export default function ProfileForm({
  setError,
  setSuccess,
}: {
  setError: (msg: string) => void
  setSuccess: (msg: string) => void
}) {
  const { data: session, status } = useSession()
  const [username, setUsername] = useState('')
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserData = async () => {
        try {
          const res = await fetch('/api/profile', { cache: 'no-store' })
          if (!res.ok) {
            const text = await res.text()
            setError(`Failed to load profile: ${text}`)
            return
          }
          const data = await res.json()
          setUsername(data.username || '')
          setPreview(data.profilePic || '')
        } catch (err) {
          setError('An unexpected error occurred while loading profile')
          console.error(err)
        }
      }
      fetchUserData()
    }
  }, [status, setError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('username', username)
    if (profilePic) formData.append('profilePic', profilePic)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const text = await res.text()
        setError(`Failed to update profile: ${text}`)
        return
      }
      const data = await res.json()
      setSuccess('Profile updated successfully!')
      setPreview(data.profilePic || preview)
    } catch (err) {
      setError('An unexpected error occurred while updating profile')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePic(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const buttonSx = {
    py: 1.5,
    fontWeight: 700,
    fontSize: 18,
    background: 'linear-gradient(90deg, #f472b6, #a78bfa, #38bdf8)',
    color: '#fff',
    boxShadow: '0 4px 20px 0 rgba(168,139,250,0.25)',
    mt: 2,
    transition: 'all 0.2s',
    '&:hover': {
      background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
    },
  }
  return (
    <Paper
      elevation={8}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'rgba(30, 27, 75, 0.85)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255,255,255,0.10)',
        maxWidth: 420,
        mx: 'auto',
        mt: 4,
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <SparkleIcon sx={{ color: '#fde68a', fontSize: 38, mb: 1 }} />
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Your Cosmic Profile
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Cosmic Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              style: { color: 'white', background: 'rgba(255,255,255,0.07)' },
            }}
            InputLabelProps={{ style: { color: '#e0e7ff' } }}
            disabled={isSubmitting}
          />
          <Box mt={2} mb={2} textAlign="center">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profilePic-upload"
              type="file"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <label htmlFor="profilePic-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{
                  color: '#a78bfa',
                  borderColor: '#a78bfa',
                  fontWeight: 600,
                  mb: 1,
                }}
                disabled={isSubmitting}
              >
                Upload Starlit Avatar
              </Button>
            </label>
            {preview && (
              <Avatar
                src={preview}
                alt="Profile Preview"
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mt: 2,
                  border: '2px solid #38bdf8',
                  boxShadow: '0 0 16px #a78bfa88',
                }}
              />
            )}
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={buttonSx}
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={22} color="inherit" />
              ) : null
            }
          >
            {isSubmitting ? 'Binding...' : 'Bind to the Cosmos'}
          </Button>
        </form>
      </Box>
    </Paper>
  )
}
