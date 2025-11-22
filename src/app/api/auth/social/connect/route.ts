import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { generateOAuthUrl, FACEBOOK_CONFIG, INSTAGRAM_CONFIG, TWITTER_CONFIG, TIKTOK_CONFIG, LINKEDIN_CONFIG } from '@/lib/social'

const SOCIAL_CONFIGS: Record<string, any> = {
  facebook: FACEBOOK_CONFIG,
  instagram: INSTAGRAM_CONFIG,
  twitter: TWITTER_CONFIG,
  tiktok: TIKTOK_CONFIG,
  linkedin: LINKEDIN_CONFIG,
}

/**
 * POST /api/auth/social/connect
 * Generate OAuth authorization URL for connecting social accounts
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { platform } = body

    if (!SOCIAL_CONFIGS[platform]) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // Generate state with user and platform info
    const state = Buffer.from(
      JSON.stringify({
        userId: user.id,
        platform,
        timestamp: Date.now(),
      })
    ).toString('base64')

    const config = SOCIAL_CONFIGS[platform]
    const authUrl = generateOAuthUrl(
      config,
      process.env[`${platform.toUpperCase()}_CLIENT_ID`] || '',
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/social/callback`,
      state
    )

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Social connect error:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/social/accounts
 * Get user's connected social accounts
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const accounts = await prisma.socialAccount.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        platform: true,
        username: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Error fetching social accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/auth/social/disconnect
 * Disconnect a social account
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { accountId } = body

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const account = await prisma.socialAccount.findUnique({
      where: { id: accountId },
    })

    if (!account || account.userId !== user.id) {
      return NextResponse.json(
        { error: 'Account not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete account
    await prisma.socialAccount.delete({
      where: { id: accountId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Social disconnect error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    )
  }
}
