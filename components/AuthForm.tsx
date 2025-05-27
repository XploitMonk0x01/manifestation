'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, Mail, Lock } from 'lucide-react'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        })
        if (!res.ok) {
          const text = await res.text()
          setError(`Sign-up failed: ${text}`)
          return
        }
        await signIn('credentials', {
          email,
          password,
          callbackUrl: '/wishlist',
        })
      } else {
        await signIn('credentials', {
          email,
          password,
          callbackUrl: '/wishlist',
        })
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSignUp && (
        <div className="relative">
          <label htmlFor="username" className="block text-sm font-medium mb-2">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-deep-space/50 text-starlight border border-nebula-blue focus:outline-none focus:ring-2 focus:ring-cosmic-purple placeholder-starlight/70"
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-starlight/70" />
          </div>
        </div>
      )}
      <div className="relative">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-deep-space/50 text-starlight border border-nebula-blue focus:outline-none focus:ring-2 focus:ring-cosmic-purple placeholder-starlight/70"
            placeholder="Enter your email"
            required
            disabled={isLoading}
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-starlight/70" />
        </div>
      </div>
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-deep-space/50 text-starlight border border-nebula-blue focus:outline-none focus:ring-2 focus:ring-cosmic-purple placeholder-starlight/70"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-starlight/70" />
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
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
            {isSignUp ? 'Signing Up...' : 'Signing In...'}
          </span>
        ) : isSignUp ? (
          'Sign Up'
        ) : (
          'Sign In'
        )}
      </motion.button>
      <div className="text-center">
        <p className="text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-nebula-blue hover:underline"
            disabled={isLoading}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
      )}
    </form>
  )
}
