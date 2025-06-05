import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '../../../lib/mongodb'
import User from '../../../models/User'
import { authOptions } from '@/lib/auth'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return new Response('User not found', { status: 404 })

  return NextResponse.json({
    username: user.username,
    profilePic: user.profilePic || '',
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return new Response('Unauthorized', { status: 401 })

  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return new Response('User not found', { status: 404 })

  const formData = await req.formData()
  const username = formData.get('username') as string
  const profilePic = formData.get('profilePic') as File | null

  // Update username
  if (username) user.username = username

  // Handle profile picture upload
  if (profilePic) {
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    await fs.mkdir(uploadDir, { recursive: true })
    const fileName = `${session.user.email}-${Date.now()}.${profilePic.name
      .split('.')
      .pop()}`
    const filePath = path.join(uploadDir, fileName)
    const buffer = Buffer.from(await profilePic.arrayBuffer())
    await fs.writeFile(filePath, buffer)
    user.profilePic = `/uploads/${fileName}`
  }

  await user.save()
  return NextResponse.json({
    message: 'Profile updated',
    username: user.username,
    profilePic: user.profilePic,
  })
}
