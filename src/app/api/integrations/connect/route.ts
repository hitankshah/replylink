import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'
import crypto from 'crypto'
import { InstagramAdapter } from '@/integrations/instagram/adapter'
import { FacebookAdapter } from '@/integrations/facebook/adapter'
import { WhatsAppAdapter } from '@/integrations/whatsapp/adapter'
import { SocialPlatform } from '@/integrations/social/adapter'
import { checkAccountLimit, getUpgradeUrl } from '@/lib/middleware/planEnforcement'

// Encryption helper
function encryptToken(token: string): string {
  const algorithm = 'aes-256-cbc'
  const key = process.env.ENCRYPTION_KEY
  const iv = crypto.randomBytes(16)

  if (!key || key.length !== 32) {
    throw new Error('Invalid ENCRYPTION_KEY. Must be 32 characters.')
  }

  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(token)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // We can use this to validate CSRF or pass extra data
    const platform = searchParams.get('platform') as SocialPlatform
    const error = searchParams.get('error')
    const errorReason = searchParams.get('error_reason')

    // Handle OAuth errors
    if (error || errorReason) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${errorReason || error}`, request.url)
      )
    }

    if (!code || !platform) {
      return NextResponse.redirect(
        new URL('/dashboard?error=missing_params', request.url)
      )
    }

    // Get user session
    const sessionToken = cookies().get('sessionToken')?.value
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check plan limits (Task 3.11)
    const accountLimit = await checkAccountLimit(session.userId)
    if (accountLimit.exceeded) {
      const upgradeUrl = getUpgradeUrl('accounts')
      return NextResponse.redirect(
        new URL(`${upgradeUrl}&error=limit_exceeded`, request.url)
      )
    }

    // Select adapter
    let adapter
    switch (platform) {
      case 'INSTAGRAM':
        adapter = new InstagramAdapter()
        break
      case 'FACEBOOK':
        adapter = new FacebookAdapter()
        break
      case 'WHATSAPP':
        adapter = new WhatsAppAdapter()
        break
      default:
        return NextResponse.redirect(
          new URL('/dashboard?error=invalid_platform', request.url)
        )
    }

    // Exchange code for token
    const result = await adapter.exchangeCodeForToken(code)

    // Store accounts
    // Note: OAuth might return multiple pages. We should probably let user select which one to connect.
    // For now, we'll connect the first one or all of them, or redirect to a selection page.
    // To keep it simple for this phase, we'll store the first available page/account.
    
    if (!result.pages || result.pages.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no_pages_found', request.url)
      )
    }

    // Encrypt access token
    const encryptedToken = encryptToken(result.accessToken)

    // We'll just connect the first page found for now
    // In a real app, you'd redirect to a page selection screen
    const page = result.pages[0]

    // Check if account already exists
    const existingAccount = await prisma.socialAccount.findFirst({
      where: {
        userId: session.userId,
        platform: platform,
        platformAccountId: page.id
      }
    })

    if (existingAccount) {
      // Update token
      await prisma.socialAccount.update({
        where: { id: existingAccount.id },
        data: {
          accessToken: encryptedToken,
          platformUsername: page.name,
          avatarUrl: page.picture,
          status: 'CONNECTED'
        }
      })
    } else {
      // Create new account
      await prisma.socialAccount.create({
        data: {
          userId: session.userId,
          platform: platform,
          platformAccountId: page.id,
          platformUsername: page.name,
          accessToken: encryptedToken,
          avatarUrl: page.picture,
          status: 'CONNECTED'
        }
      })
    }

    return NextResponse.redirect(
      new URL('/dashboard?success=account_connected', request.url)
    )

  } catch (error) {
    console.error('OAuth Callback Error:', error)
    return NextResponse.redirect(
      new URL('/dashboard?error=oauth_failed', request.url)
    )
  }
}
