import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import {
  FACEBOOK_CONFIG,
  INSTAGRAM_CONFIG,
  TWITTER_CONFIG,
  TIKTOK_CONFIG,
  LINKEDIN_CONFIG,
  exchangeCodeForToken,
  getUserInfo,
} from '@/lib/social'

const SOCIAL_CONFIGS: Record<string, any> = {
  facebook: FACEBOOK_CONFIG,
  instagram: INSTAGRAM_CONFIG,
  twitter: TWITTER_CONFIG,
  tiktok: TIKTOK_CONFIG,
  linkedin: LINKEDIN_CONFIG,
}

/**
 * GET /api/auth/social/callback
 * OAuth callback handler for all social platforms
 */
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code')
    const state = request.nextUrl.searchParams.get('state')
    const error = request.nextUrl.searchParams.get('error')

    if (error) {
      return NextResponse.json(
        { error: `Social auth error: ${error}` },
        { status: 400 }
      )
    }

    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state' },
        { status: 400 }
      )
    }

    // Decode state (should contain platform and userId)
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    const { platform, userId } = stateData

    if (!SOCIAL_CONFIGS[platform]) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      )
    }

    // Verify user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Exchange code for access token
    const config = SOCIAL_CONFIGS[platform]
    const tokens = await exchangeCodeForToken(
      config,
      code,
      process.env[`${platform.toUpperCase()}_CLIENT_ID`] || '',
      process.env[`${platform.toUpperCase()}_CLIENT_SECRET`] || '',
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/social/callback`
    )

    // Get user info
    const userInfo = await getUserInfo(config, tokens.accessToken)

    // Save social account
    const platformType = platform.toUpperCase()
    const socialAccount = await prisma.socialAccount.upsert({
      where: {
        userId_platform_platformUserId: {
          userId,
          platform: platformType as any,
          platformUserId: tokens.userId || userInfo.id,
        },
      },
      update: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        tokenExpiresAt: tokens.expiresIn
          ? new Date(Date.now() + tokens.expiresIn * 1000)
          : null,
        isActive: true,
      },
      create: {
        userId,
        platform: platformType as any,
        platformUserId: tokens.userId || userInfo.id,
        username: userInfo.username || userInfo.name,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        tokenExpiresAt: tokens.expiresIn
          ? new Date(Date.now() + tokens.expiresIn * 1000)
          : null,
        isActive: true,
      },
    })

    // Redirect to dashboard
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?social=${platform}&success=true`
    )
  } catch (error) {
    console.error('Social auth callback error:', error)
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 500 }
    )
  }
}
