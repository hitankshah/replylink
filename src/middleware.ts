import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/reset-password',
]

// Routes that match dynamic parameters
const DYNAMIC_ROUTES = [
  /^\/[^/]+$/, // /:username - link-in-bio pages
]

// Routes that are always public
const WEBHOOK_ROUTES = [
  /^\/api\/webhooks\/.*/, // Webhook endpoints
]

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
)

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const method = req.method

  // Always allow webhooks
  if (WEBHOOK_ROUTES.some(route => route.test(pathname))) {
    return NextResponse.next()
  }

  // Allow public routes without authentication
  if (PUBLIC_ROUTES.includes(pathname) || PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow dynamic routes (username pages) without authentication
  if (DYNAMIC_ROUTES.some(route => route.test(pathname))) {
    return NextResponse.next()
  }

  // Allow home page without authentication
  if (pathname === '/') {
    return NextResponse.next()
  }

  // For protected routes, check for valid session
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/') && !pathname.includes('/api/auth')) {
    const sessionToken = req.cookies.get('sessionToken')?.value

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // Verify JWT signature using jose (Edge compatible)
    // try {
    //   await jwtVerify(sessionToken, JWT_SECRET)
    //   // Token is valid
    //   return NextResponse.next()
    // } catch (error) {
    //   console.error('Session verification error:', error)
    //   // Token is invalid or expired
    //   const response = NextResponse.redirect(new URL('/auth/login', req.url))
    //   response.cookies.delete('sessionToken')
    //   return response
    // }
    return NextResponse.next() // TEMPORARY DEBUG BYPASS
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
