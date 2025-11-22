import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json(
        { success: true, message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiry

    // Store token in database
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // TODO: Send email with reset link
    // For now, just log it
    const resetLink = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/auth/reset?token=${token}`
    console.log('Password reset link:', resetLink)
    console.log('Send email to:', email)

    return NextResponse.json(
      { success: true, message: 'If an account exists with this email, a password reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    )
  }
}
