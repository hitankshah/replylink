import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Verify session exists in database
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
      })

      if (!session || session.expires < new Date()) {
        // Session expired or not found
        const response = NextResponse.redirect(new URL('/auth/login', req.url))
        response.cookies.delete('sessionToken')
        return response
      }
    } catch (error) {
      console.error('Session verification error:', error)
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
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
