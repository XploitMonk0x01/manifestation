'use client'

import { Box, Button, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const errors: { [key: string]: string } = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'Unable to sign in.',
}

function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorMessage = error && (errors[error] || errors.Default)

  useEffect(() => {
    if (!error) {
      router.push('/login')
    }
  }, [error, router])

  if (!error) {
    return null
  }

  return (
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
      <Box textAlign="center">
        <Typography variant="h6" fontWeight={600} color="error" mb={2}>
          Authentication Error
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {errorMessage}
        </Typography>
        <Button
          onClick={() => router.push('/login')}
          variant="contained"
          sx={{
            mt: 2,
            py: 1.5,
            fontWeight: 700,
            fontSize: 16,
            background: 'linear-gradient(90deg, #f472b6, #a78bfa, #fde68a)',
            color: '#fff',
            '&:hover': {
              background: 'linear-gradient(90deg, #a78bfa, #f472b6, #fde68a)',
            },
          }}
        >
          Return to Sign In
        </Button>
      </Box>
    </Paper>
  )
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense
        fallback={
          <Typography color="white" textAlign="center">
            Loading...
          </Typography>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  )
}
