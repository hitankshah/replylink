import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
// Note: CSRF and rate limiting disabled in middleware due to Edge Runtime limitations
// These will be handled in individual API routes instead

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/link',
    '/api/auth',
    '/api/csrf-token',
    '/api/webhooks',
  ]

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - require authentication
  const token = req.cookies.get('auth-token')?.value

  if (!token) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const user = await verifyToken(token)
    if (!user) {
      const loginUrl = new URL('/auth/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', user.id)
    requestHeaders.set('x-user-email', user.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Auth middleware error:', error)
    const loginUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
