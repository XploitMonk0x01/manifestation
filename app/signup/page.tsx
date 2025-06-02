'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import SignupForm from '@/components/SignupForm'

const ParticlesBg = dynamic(() => import('@/components/ParticlesBg'), {
  ssr: false,
})

export default function Signup() {
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
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0B1121]">
      <ParticlesBg />

      <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-purple/20 to-nebula-blue/20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-lg mx-auto"
      >
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white"
          >
            Messages to <span className="text-nebula-blue">Universe</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-white/60"
          >
            Create your account to get started
          </motion.p>
        </div>

        {/* Main Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5">
          <SignupForm />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-white/40 bg-[#0B1121]/95">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-white/40">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-nebula-blue hover:text-nebula-blue/80 transition-colors"
          >
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  )
}
