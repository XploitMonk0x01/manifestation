import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Using default Node.js runtime since NextAuth needs Node.js crypto module
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
