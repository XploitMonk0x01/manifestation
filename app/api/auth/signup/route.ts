import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Using default Node.js runtime since we need bcrypt
const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password } = signupSchema.parse(body)

    await connectToDatabase()

    // Check for existing user with same email or username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username'
      return NextResponse.json(
        { error: `This ${field} is already taken` },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      email,
      password: hashedPassword,
      profilePic: '',
    })
    await user.save()

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
