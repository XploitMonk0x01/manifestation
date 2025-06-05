'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Paper from '@mui/material/Paper'

const errors: { [key: string]: string } = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'Unable to sign in.',
}

export default function ErrorPage() {
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
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Return to Sign In
          </button>
        </div>
      </Paper>
    </div>
  )
}
