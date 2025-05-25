import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import redis from '@/lib/redis'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req: NextRequest) =>
    req.headers.get('x-forwarded-for') || 'anonymous',
})

export async function GET(req: NextRequest) {
  try {
    await new Promise((resolve, reject) => {
      limiter(req as any, {} as any, (err) =>
        err ? reject(err) : resolve(null)
      )
    })
  } catch (err) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cacheKey = `wishes:${session.user.email}`
  const cachedWishes = await redis.get(cacheKey)
  if (cachedWishes) {
    return NextResponse.json(JSON.parse(cachedWishes))
  }

  await connectToDatabase()
  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const wishes = user.wishes || []
  await redis.set(cacheKey, JSON.stringify(wishes), 'EX', 3600)
  return NextResponse.json(wishes)
}

export async function POST(req: NextRequest) {
  try {
    await new Promise((resolve, reject) => {
      limiter(req as any, {} as any, (err) =>
        err ? reject(err) : resolve(null)
      )
    })
  } catch (err) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  if (!session) {
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
  await redis.del(cacheKey)

  const newWish = user.wishes[user.wishes.length - 1];
  return NextResponse.json(newWish, { status: 201 }); // Return the newly created wish and status 201
}

export async function PATCH(req: NextRequest) {
  try {
    await new Promise((resolve, reject) => {
      limiter(req as any, {} as any, (err) =>
        err ? reject(err) : resolve(null)
      )
    })
  } catch (err) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const session = await getServerSession(authOptions)
  if (!session) {
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
  await redis.del(cacheKey)

  return NextResponse.json(wish); // Return the updated wish sub-document
}
