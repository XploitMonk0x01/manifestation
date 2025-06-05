'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
  Paper,
} from '@mui/material'
import { motion } from 'framer-motion'
import WishCard from '../../components/WishCard'
import dynamic from 'next/dynamic'

const ParticlesBg = dynamic(() => import('../../components/ParticlesBg'), {
  ssr: false,
})

export default function PublicWishesPage() {
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`/api/public-wishes?page=${page}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then((data) => {
        setWishes(data.wishes)
        setTotalPages(data.pagination.totalPages)
      })
      .catch((err) => setError(err.message || 'Failed to load wishes'))
      .finally(() => setLoading(false))
  }, [page])

  return (
    <Box
      minHeight={{ xs: '100vh', md: '100vh' }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #312e81 100%)',
        pt: { xs: 6, md: 10 },
        pb: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 0 },
        position: 'relative',
      }}
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
          Wishes from the Universe
        </Typography>
      </motion.div>
      <Paper
        elevation={8}
        sx={{
          p: 2,
          borderRadius: 4,
          background: 'rgba(30, 27, 75, 0.85)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255,255,255,0.10)',
          mb: 4,
          maxWidth: 700,
          width: '100%',
        }}
      >
        <Typography variant="subtitle1" color="#e0e7ff" align="center">
          Explore the dreams and hopes shared by others. Let their wishes
          inspire your own journey!
        </Typography>
      </Paper>
      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight={200}
        >
          <CircularProgress size={40} sx={{ color: '#a78bfa' }} />
          <Typography variant="h6" color="#e0e7ff" ml={2}>
            Gathering Cosmic Wishes...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2, fontWeight: 500 }}>
          {error}
        </Alert>
      ) : wishes.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2, fontWeight: 500 }}>
          No public wishes found.
        </Alert>
      ) : (
        <Box
          mt={{ xs: 4, md: 6 }}
          width="100%"
          maxWidth={900}
          px={{ xs: 1, sm: 2, md: 0 }}
        >
          <Stack spacing={3}>
            {wishes.map((w) => (
              <WishCard
                key={w.wishId || w._id}
                text={w.text}
                date={w.date}
                user={w.user}
              />
            ))}
          </Stack>
        </Box>
      )}
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{
            mt: 6,
            mb: 2,
            '& .MuiPaginationItem-root': { color: '#a78bfa' },
          }}
        />
      )}
    </Box>
  )
}
