import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createSession } from '@/lib/auth'
import { signupSchema } from '@/lib/validators'
import { validateRequest } from '@/lib/validators/utils'

export async function POST(req: NextRequest) {
  try {
    // Validate request body
    const validation = await validateRequest(req, signupSchema)
    if (!validation.success) {
      return validation.error
    }

    const { email, password, name, brand, timezone } = validation.data

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // Create free subscription for user
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        status: 'active',
        gatewayId: `free-${user.id}`,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    })

    // Create default link page with brand name
    await prisma.linkPage.create({
      data: {
        userId: user.id,
        username: email.split('@')[0] + Math.random().toString(36).substring(7),
        title: brand || name,
        bio: `Welcome to ${brand || name}'s link page`,
      },
    })

    // Create session
    const session = await createSession(user.id, 7)

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
      { status: 201 }
    )

    // Set HTTP-only cookie with session token
    response.cookies.set({
      name: 'sessionToken',
      value: session.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
