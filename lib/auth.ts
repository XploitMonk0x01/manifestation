import NextAuth, { NextAuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextRequest } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { GetServerSidePropsContext } from 'next'
import { NextApiRequest, NextApiResponse } from 'next'

interface MongoUser {
  _id: any
  username: string
  email: string
  password?: string
  profilePic?: string
  save(): Promise<MongoUser>
}

// Define the NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase()
        const user = (await User.findOne({
          email: credentials?.email,
        })) as MongoUser | null
        if (
          user &&
          user.password && // Add this check
          credentials?.password &&
          bcrypt.compareSync(credentials.password, user.password)
        ) {
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
          }
        }
        return null
      },
    }),
  ],
  pages: { signIn: '/login' },
  callbacks: {
    async signIn({ user, account, profile }: any) {
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
    },
    async jwt({ token, user }: any) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }: any) {
      session.user.id = token.id
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to get the session in API routes
export async function getSession(req: NextRequest) {
  return await getServerSession(authOptions)
}

// Helper function to check if a user is authenticated
export async function isAuthenticated(req: NextRequest) {
  const session = await getSession(req)
  return !!session
}
