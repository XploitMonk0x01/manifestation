import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LRUCache } from 'lru-cache'

export const runtime = 'experimental-edge'

// Initialize rate limiter with more lenient limits
const rateLimit = new LRUCache({
  max: 1000, // Store more IPs
  ttl: 1000 * 60, // 1 minute TTL
})

// Define public routes that don't require authentication
const publicRoutes = ['/api/auth', '/api/public-wishes', '/login', '/signup']

// Define routes that should be rate-limited
const rateLimitedRoutes = ['/api/wishes', '/api/profile']

// Custom rate limiter middleware for Next.js with Edge compatibility
async function rateLimiterMiddleware(req: NextRequest): Promise<boolean> {
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  const pathname = req.nextUrl.pathname
  const key = `${ip}:${pathname}`

  const currentCount = (rateLimit.get(key) as number) || 0

  // Increased rate limit to 60 requests per minute
  if (currentCount >= 60) {
    return false
  }

  rateLimit.set(key, currentCount + 1)
  return true
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Skip middleware for public routes and static files
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Apply rate limiting for specific routes
  if (rateLimitedRoutes.some((route) => pathname.startsWith(route))) {
    const isAllowed = await rateLimiterMiddleware(req)
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      )
    }
  }

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  return response
}

export const config = {
  matcher: [
    // Match all paths except static files, images, and auth routes
    '/((?!_next/static|_next/image|favicon.ico|public/|api/auth/).*)',
  ],
}
