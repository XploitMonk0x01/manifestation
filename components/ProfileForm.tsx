'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'

export default function ProfileForm({
  setError,
  setSuccess,
}: {
  setError: (msg: string) => void
  setSuccess: (msg: string) => void
}) {
  const { data: session, status } = useSession()
  const [username, setUsername] = useState('')
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserData = async () => {
        try {
          const res = await fetch('/api/profile', { cache: 'no-store' })
          if (!res.ok) {
            const text = await res.text()
            setError(`Failed to load profile: ${text}`)
            return
          }
          const data = await res.json()
          setUsername(data.username || '')
          setPreview(data.profilePic || '')
        } catch (err) {
          setError('An unexpected error occurred while loading profile')
          console.error(err)
        }
      }
      fetchUserData()
    }
  }, [status, setError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('username', username)
    if (profilePic) formData.append('profilePic', profilePic)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const text = await res.text()
        setError(`Failed to update profile: ${text}`)
        return
      }
      const data = await res.json()
      setSuccess('Profile updated successfully!')
      setPreview(data.profilePic || preview)
    } catch (err) {
      setError('An unexpected error occurred while updating profile')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePic(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-starlight"
        >
          Cosmic Name
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mt-1 rounded-lg bg-transparent text-starlight border border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-nebula-blue placeholder-starlight/50"
          placeholder="Your universal moniker"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label
          htmlFor="profilePic"
          className="block text-sm font-medium text-starlight"
        >
          Starlit Avatar
        </label>
        <input
          type="file"
          id="profilePic"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 mt-1 rounded-lg bg-transparent text-starlight border border-purple-500 file:bg-purple-500 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
          disabled={isSubmitting}
        />
        {preview && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={preview}
            alt="Profile Preview"
            className="mt-4 w-32 h-32 rounded-full object-cover border-2 border-nebula-blue mx-auto shadow-lg animate-pulseGlow"
          />
        )}
      </div>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: '0 0 15px rgba(30, 144, 255, 0.5)',
        }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-nebula-blue rounded-full text-white font-semibold text-lg transition-all duration-300 animate-pulseGlow ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (
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
            Binding...
          </span>
        ) : (
          'Bind to the Cosmos'
        )}
      </motion.button>
    </form>
  )
}
