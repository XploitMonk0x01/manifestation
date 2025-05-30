'use client'

import { useState } from 'react'
import AuthForm from '../../components/AuthForm'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
const ParticlesBg = dynamic(() => import('../../components/ParticlesBg'), {
  ssr: false,
})

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/wishlist' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Gradient Wave */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cosmic-purple/20 to-nebula-blue/20"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(74, 0, 224, 0.2) 0%, rgba(142, 45, 226, 0.2) 100%)',
            'linear-gradient(135deg, rgba(142, 45, 226, 0.2) 0%, rgba(74, 0, 224, 0.2) 100%)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      />
      <ParticlesBg />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative neumorphic p-8 rounded-2xl max-w-md w-full bg-deep-space/70 backdrop-blur-md border border-nebula-blue/50"
      >
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-8 text-center text-starlight text-glow-starlight">
          Welcome to the Universe
        </h2>
        <AuthForm />
        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full px-6 py-3 gradient-btn rounded-full text-starlight font-semibold text-lg transition-all duration-300 animate-glow ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-starlight"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign in with Google'
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
