import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import cache from '@/lib/cache'

// Rate limiting with LRU Cache
const rateLimitCache = new Map()
const RATE_LIMIT_DURATION = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 60 // 60 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userRequests = rateLimitCache.get(ip) || []

  // Remove old requests
  const validRequests = userRequests.filter(
    (timestamp: number) => now - timestamp < RATE_LIMIT_DURATION
  )

  if (validRequests.length >= RATE_LIMIT_MAX) {
    return true
  }

  validRequests.push(now)
  rateLimitCache.set(ip, validRequests)
  return false
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    )
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cacheKey = `wishes:${session.user.email}`
  const cachedWishes = cache.get(cacheKey)
  if (cachedWishes) {
    return NextResponse.json(cachedWishes)
  }

  await connectToDatabase()
  interface UserType {
    email: string
    wishes: { text: string; date: Date; isPublic: boolean }[]
  }

  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const typedUser = user as unknown as UserType
  if (!typedUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const wishes = typedUser.wishes || []
  cache.set(cacheKey, wishes)
  return NextResponse.json(wishes)
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    )
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { text, isPublic = false } = await req.json()
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Invalid wish text' }, { status: 400 })
  }

  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  user.wishes.push({ text, date: new Date(), isPublic })
  await user.save()

  const cacheKey = `wishes:${session.user.email}`
  cache.delete(cacheKey)

  const newWish = user.wishes[user.wishes.length - 1]
  return NextResponse.json(newWish, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later' },
      { status: 429 }
    )
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { wishId, isPublic } = await req.json()
  if (!wishId || typeof isPublic !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const wish = user.wishes.id(wishId)
  if (!wish) {
    return NextResponse.json({ error: 'Wish not found' }, { status: 404 })
  }

  wish.isPublic = isPublic
  await user.save()

  const cacheKey = `wishes:${session.user.email}`
  cache.delete(cacheKey)

  return NextResponse.json(wish)
}
