import { NextRequest, NextResponse } from "next/server";
import { getSession, isAuthenticated } from "@/lib/auth";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import type { Redis as RedisType } from "ioredis";
import { Session } from "next-auth";

// Initialize Redis client for rate limiting
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Define session user type
interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

// Custom rate limiter middleware for Next.js
async function rateLimiterMiddleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const key = `rate-limit:${ip}`;
  
  try {
    const requests = await redisClient.incr(key);
    
    if (requests === 1) {
      await redisClient.expire(key, 15 * 60); // 15 minutes in seconds
    }
    
    if (requests > 100) { // 100 requests per 15 minutes
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Rate limiter error:", error);
    return true; // Allow request on Redis error
  }
}

// Define public routes that don't require authentication
const publicRoutes = ["/api/auth", "/api/public-wishes"];

// Define routes that should be rate-limited
const rateLimitedRoutes = ["/api/wishes", "/api/profile", "/api/public-wishes"];

export async function middleware(req: NextRequest) {
  // 1. Logging: Log every request for debugging and monitoring
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // 2. CORS Handling: Add CORS headers for API routes
  const response = NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Adjust this for production
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  // Handle OPTIONS requests for CORS preflight
  if (req.method === "OPTIONS") {
    return response;
  }

  // 3. Rate Limiting: Apply rate limiting to specific API routes
  const shouldRateLimit = rateLimitedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  
  if (shouldRateLimit) {
    const isAllowed = await rateLimiterMiddleware(req);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  // 4. Authentication Check: Skip for public routes, enforce for protected routes
  const isPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!isPublicRoute && req.nextUrl.pathname.startsWith("/api")) {
    const session = await getSession(req) as CustomSession | null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Now TypeScript knows session.user exists and has an id
    response.headers.set("x-user-id", session.user.id);
  }

  // 5. Error Handling: Catch any errors thrown in the API routes
  try {
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Configure which routes the middleware applies to
export const config = {
  matcher: "/api/:path*", // Apply middleware to all API routes
};