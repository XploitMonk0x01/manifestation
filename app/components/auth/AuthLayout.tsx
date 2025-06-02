import { FC, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

const AuthLayout: FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  )
}

export default AuthLayout
