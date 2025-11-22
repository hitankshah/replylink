import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createSession, generateToken } from '@/lib/auth'
import { verifyTestBypass } from '@/lib/testBypass'
import { loginSchema } from '@/lib/validators'
import { validateRequest } from '@/lib/validators/utils'

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(req, loginSchema)
    if (!validation.success) {
      return validation.error
    }

    const { email, password, rememberMe } = validation.data

    // Check for test bypass credentials first (for development/testing only)
    const testUser = verifyTestBypass(email, password)
    if (testUser) {
      console.warn(`[TEST BYPASS] Admin login attempt with email: ${email}`)

      const token = generateToken({
        userId: testUser.id,
        email: testUser.email,
      })

      return NextResponse.json(
        {
          success: true,
          user: {
            id: testUser.id,
            email: testUser.email,
            name: testUser.name,
            role: testUser.role,
          },
          token,
          message: '🔐 TEST BYPASS: Using test credentials. Do not use in production!',
        },
        { status: 200 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Create session
    const sessionDuration = rememberMe ? 30 : 7 // 30 days or 7 days
    const session = await createSession(user.id, sessionDuration)

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    )

    // Set HTTP-only cookie with session token
    response.cookies.set({
      name: 'sessionToken',
      value: session.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionDuration * 24 * 60 * 60, // Convert days to seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
