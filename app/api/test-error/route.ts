import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Intentionally throw an error to test the middleware
  throw new Error('This is a test error')
  return NextResponse.json({ message: "This won't be reached" })
}
