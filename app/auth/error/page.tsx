import { Box, Button, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthErrorDisplay from '@/components/AuthErrorDisplay'

const errors: { [key: string]: string } = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'Unable to sign in.',
}

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const errorType = searchParams.get('error')

  useEffect(() => {
    if (errorType && errors[errorType]) {
      // Log the specific error for debugging
      console.error('Auth Error:', errors[errorType])
    }
  }, [errorType])

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
        <Box textAlign="center" mb={2}>
          <Typography variant="h5" component="h1" gutterBottom>
            Authentication Error
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {errorType && errors[errorType]
              ? errors[errorType]
              : errors.Default}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackToHome}
          fullWidth
        >
          Back to Home
        </Button>
      </Paper>
    </div>
  )
}
