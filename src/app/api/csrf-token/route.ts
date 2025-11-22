import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken, addCSRFTokenToResponse } from '@/lib/csrf'

/**
 * GET /api/csrf-token
 * Generate and return a CSRF token for client-side forms
 */
export async function GET(request: NextRequest) {
  try {
    // Generate new token
    const token = generateCSRFToken()

    // Create response with token
    const response = NextResponse.json({
      csrfToken: token,
      message: 'CSRF token generated successfully',
    })

    // Add token to cookies
    addCSRFTokenToResponse(response, token)

    return response
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
