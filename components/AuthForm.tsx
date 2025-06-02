'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AuthFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void> | void
  error?: string | null
}

export default function AuthForm({ onSubmit, error }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ email, password })
  }

  if (!isMounted) {
    return null // Prevent hydration mismatch by not rendering anything until client-side
  }

  return (
    <div className="w-full" suppressHydrationWarning>
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-6"
        suppressHydrationWarning
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg px-4 py-3 text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="group relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white/5 rounded-lg border border-white/10 text-white placeholder:text-white/50 focus:border-nebula-blue/50 focus:ring-2 focus:ring-nebula-blue/20 transition-all outline-none"
              placeholder="Email address"
              autoComplete="email"
              suppressHydrationWarning
            />
          </div>
          <div className="group relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-white/5 rounded-lg border border-white/10 text-white placeholder:text-white/50 focus:border-nebula-blue/50 focus:ring-2 focus:ring-nebula-blue/20 transition-all outline-none"
              placeholder="Password"
              autoComplete="current-password"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 text-white/70 hover:text-white cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-white/20 bg-white/5"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              suppressHydrationWarning
            />
            <span>Remember me</span>
          </label>
          <a
            href="#"
            className="text-nebula-blue hover:text-nebula-blue/80 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-4 bg-nebula-blue rounded-lg text-white font-medium hover:bg-nebula-blue/90 transition-all focus:ring-2 focus:ring-nebula-blue/50"
          suppressHydrationWarning
        >
          Sign in
        </motion.button>
      </form>
    </div>
  )
}
