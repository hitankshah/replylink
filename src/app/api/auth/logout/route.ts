import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = req.cookies.get('sessionToken')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      )
    }

    // Delete session from database
    await prisma.session.delete({
      where: { sessionToken },
    }).catch(() => {
      // Session may not exist, ignore error
    })

    // Create response
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )

    // Clear HTTP-only cookie
    response.cookies.delete('sessionToken')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
