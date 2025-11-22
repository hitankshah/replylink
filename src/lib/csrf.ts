import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const CSRF_TOKEN_LENGTH = 32
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_COOKIE_NAME = 'csrf-token'

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

/**
 * Hash a CSRF token (to compare with stored token)
 */
export function hashCSRFToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Add CSRF token to response
 */
export function addCSRFTokenToResponse(response: NextResponse, token: string): NextResponse {
  // Set as HTTP-only cookie (cannot be accessed via JavaScript)
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  })

  return response
}

/**
 * Verify CSRF token from request
 * Returns true if valid, false otherwise
 */
export function verifyCSRFToken(request: NextRequest, tokenFromBody: string): boolean {
  try {
    // Get token from cookies
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

    if (!cookieToken || !tokenFromBody) {
      return false
    }

    // Hash both tokens and compare
    const hashCookie = hashCSRFToken(cookieToken)
    const hashBody = hashCSRFToken(tokenFromBody)

    return hashCookie === hashBody
  } catch (error) {
    console.error('CSRF verification error:', error)
    return false
  }
}

/**
 * CSRF validation middleware for API routes
 * Should be used for POST, PUT, DELETE, PATCH requests
 */
export async function csrfProtection(request: NextRequest) {
  // Only validate state-changing requests
  const method = request.method
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return true // Skip CSRF check for GET, OPTIONS, HEAD
  }

  try {
    const body = await request.json()
    const csrfToken = body._csrf || request.headers.get(CSRF_HEADER_NAME)

    if (!csrfToken) {
      return false // CSRF token missing
    }

    return verifyCSRFToken(request, csrfToken)
  } catch (error) {
    console.error('CSRF protection error:', error)
    return false
  }
}

/**
 * Response with CSRF error
 */
export function csrfErrorResponse() {
  return NextResponse.json(
    {
      error: 'CSRF token validation failed',
      message: 'Invalid or missing CSRF token',
    },
    { status: 403 }
  )
}

/**
 * Get CSRF token from request (for client to use)
 */
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value || null
}
