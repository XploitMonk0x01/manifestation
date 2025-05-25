'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import WishCard from '../../components/WishCard'
// import ParticlesBg from '../../components/ParticlesBg'
import dynamic from 'next/dynamic'
const ParticlesBg = dynamic(() => import('../../components/ParticlesBg'), {
  ssr: false,
})

export default function Wishlist() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wish, setWish] = useState('')
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchWishes = async () => {
        try {
          const res = await fetch('/api/wishes', { cache: 'no-store' })
          if (!res.ok) {
            const text = await res.text()
            setError(`Failed to fetch wishes: ${text}`)
            if (res.status === 401) router.push('/login')
            return
          }
          const data = await res.json()
          setWishes(data)
        } catch (err) {
          setError('An unexpected error occurred')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      fetchWishes()
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <p className="text-starlight text-center mt-20">Gathering Stardust...</p>
    )
  }

  if (!session) return null

  const sendWish = async () => {
    if (!wish.trim()) return
    setIsSending(true)
    setError('')
    setSuccessMessage('')
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: wish }),
      })
      if (res.ok) {
        // Assuming the API returns the created wish including its date
        const createdWish = await res.json(); // Or use the optimistic update if API doesn't return the full wish
        setWishes(prevWishes => [...prevWishes, createdWish]);
        setWish('');
        setSuccessMessage('Your wish has been sent to the stars! ✨');
        setTimeout(() => setSuccessMessage(''), 5000); // Auto-hide after 5 seconds
      } else {
        const text = await res.text()
        setError(`Failed to add wish: ${text}`)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-20 pb-8 px-4">
      <ParticlesBg />
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-bold text-starlight mb-12 text-center tracking-wide"
      >
        Whisper to the Cosmos
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-full max-w-xl glass-effect p-6 rounded-2xl relative z-10 border border-nebula-blue/30"
      >
        <textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          className="w-full p-4 rounded-lg bg-transparent text-starlight border border-cosmic-purple/50 focus:outline-none focus:ring-2 focus:ring-nebula-blue placeholder-starlight/50 resize-none h-32 text-lg"
          placeholder="Speak your wish..."
          disabled={isSending}
        />
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 15px var(--nebula-blue)', // Use CSS variable for hover
          }}
          whileTap={{ scale: 0.95 }}
          onClick={sendWish}
          disabled={isSending}
          className={`mt-4 w-full px-6 py-3 bg-gradient-to-r from-cosmic-purple to-nebula-blue rounded-full text-white font-semibold text-lg transition-all duration-300 animate-pulseGlow ${
            isSending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
              Sending...
            </span>
          ) : (
            'Send to the Stars'
          )}
        </motion.button>
        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}
        {successMessage && (
          <p className="text-starlight text-sm mt-4 text-center">{successMessage}</p>
        )}
      </motion.div>
      <div className="mt-12 w-full max-w-3xl space-y-6 relative z-10">
        {wishes.map((w) => (
          // Assuming 'w' will have an '_id' from MongoDB once fetched or created via API
          <WishCard key={w._id} text={w.text} date={w.date} />
        ))}
      </div>
    </div>
  )
}
