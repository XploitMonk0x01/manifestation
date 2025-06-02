import NextAuth, { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

interface MongoUser {
  _id: any
  username: string
  email: string
  password?: string
  profilePic?: string
  save(): Promise<MongoUser>
}

// Defensive check for required env vars
function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: requiredEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requiredEnv('GOOGLE_CLIENT_SECRET'),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          await connectToDatabase()
          const user = (await User.findOne({
            email: credentials.email,
          })) as MongoUser | null

          if (!user || !user.password) {
            throw new Error('Invalid email or password')
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )
          if (!isValid) {
            throw new Error('Invalid email or password')
          }

          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            image: user.profilePic,
          }
        } catch (error) {
          // Log the error but don't expose internal details
          console.error('Auth error:', error)
          throw new Error(
            error instanceof Error ? error.message : 'Authentication failed'
          )
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        await connectToDatabase()
        let dbUser = (await User.findOne({
          email: user.email,
        })) as MongoUser | null

        if (!dbUser) {
          const newUser = new User({
            username: user.name || user.email.split('@')[0],
            email: user.email,
            profilePic: user.image || '',
          }) as MongoUser
          dbUser = await newUser.save()
        }

        user.id = dbUser._id.toString()
        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        ;(session.user as any).id = token.id
      }
      return session
    },
  },
  secret: requiredEnv('NEXTAUTH_SECRET'),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
}

export async function getSession(req?: any) {
  return await getServerSession(authOptions)
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}
