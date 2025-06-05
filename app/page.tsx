import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Box, Paper, Typography, Button, Stack } from '@mui/material'

export default async function Home() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (err) {
    // Optionally log error or show a fallback UI
  }
  if (session) redirect('/wishlist')

  return (
    <Box
      minHeight={{ xs: '100vh', md: '100vh' }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background:
          'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, sm: 2, md: 0 },
      }}
    >
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
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 2,
              textAlign: 'center',
              textShadow: '0 2px 24px #a78bfa55',
              fontFamily: 'Inter, sans-serif',
              fontSize: { xs: 28, sm: 32, md: 40 },
              mb: 2,
            }}
          >
            Welcome
          </Typography>
          <Typography
            variant="h6"
            color="white"
            fontWeight={500}
            sx={{ textAlign: 'center', opacity: 0.85, fontSize: { xs: 16, sm: 18 } }}
          >
            Whisper your wishes to the cosmos and see them shine among the stars.
          </Typography>
          <Button
            href="/login"
            size="large"
            variant="contained"
            sx={{
              mt: 2,
              px: { xs: 3, sm: 6 },
              py: 1.5,
              fontWeight: 700,
              fontSize: { xs: 16, sm: 18, md: 20 },
              borderRadius: 99,
              background: 'linear-gradient(90deg, #a78bfa, #f472b6, #38bdf8)',
              color: '#fff',
              boxShadow: '0 4px 20px 0 rgba(168,139,250,0.25)',
              '&:hover': {
                background: 'linear-gradient(90deg, #f472b6, #a78bfa, #38bdf8)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            Get Started
          </Button>
        </Stack>
      </Paper>
      {/* Optional: Add a blurred cosmic background effect */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 60% 40%, #fde68a33 0%, transparent 60%), radial-gradient(circle at 30% 70%, #a78bfa22 0%, transparent 70%)',
        }}
      />
    </Box>
  )
}
