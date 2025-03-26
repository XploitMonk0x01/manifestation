'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  }

  const linkVariants = {
    hover: {
      scale: 1.1,
      color: 'var(--accent-teal)',
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  }

  const links = [
    { href: '/', label: 'Home' },
    ...(session
      ? [
          { href: '/wishlist', label: 'Wishlist' },
          { href: '/profile', label: 'Profile' },
        ]
      : [{ href: '/login', label: 'Login' }]),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-primary-dark/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div variants={logoVariants} initial="hidden" animate="visible">
          <Link
            href="/"
            className="text-3xl font-bold text-white flex items-center"
          >
            <span className="mr-2">🌌</span> Cosmic Messages
          </Link>
        </motion.div>

        <div className="hidden md:flex flex-row space-x-6">
          {links.map((link) => (
            <motion.div
              key={link.href}
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <Link
                href={link.href}
                className={`text-white text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-accent-teal/20 to-accent-gold/20'
                    : 'hover:bg-gradient-to-r hover:from-accent-teal/20 hover:to-accent-gold/20'
                }`}
              >
                {link.label}
              </Link>
              {pathname === link.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-teal to-accent-gold rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
          {session && (
            <motion.button
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => signOut()}
              className="text-white text-lg font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-accent-teal/20 hover:to-accent-gold/20 transition-all duration-300"
            >
              Logout
            </motion.button>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 flex flex-col space-y-4 bg-primary-dark/90 p-4 rounded-lg"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white text-lg font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-accent-teal/20 to-accent-gold/20'
                    : 'hover:bg-gradient-to-r hover:from-accent-teal/20 hover:to-accent-gold/20'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="text-white text-lg font-medium px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-accent-teal/20 hover:to-accent-gold/20 transition-all duration-300 text-left"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
