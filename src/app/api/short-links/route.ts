import { NextRequest, NextResponse } from 'next/server'
import {
  createShortLink,
  getPageShortLinks,
  deleteShortLink,
  updateShortLinkTarget,
} from '@/lib/shortLink'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/short-links
 * Create a new short link
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
    const { pageId, buttonId, customSlug } = body

    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        workspace: {
          select: {
            members: {
              where: { userId: user.id },
              select: { id: true },
            },
          },
        },
      },
    })

    if (!page || page.workspace.members.length === 0) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    // Get target URL
    let targetUrl: string

    if (buttonId) {
      const button = await prisma.button.findUnique({
        where: { id: buttonId },
        select: { url: true },
      })

      if (!button) {
        return NextResponse.json(
          { error: 'Button not found' },
          { status: 404 }
        )
      }

      targetUrl = button.url
    } else {
      // Use page URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://replylink.io'
      targetUrl = `${baseUrl}/link/${page.id}`
    }

    const result = await createShortLink(targetUrl, pageId, buttonId, customSlug)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Short link creation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create short link'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

/**
 * GET /api/short-links?pageId=xxx
 * Get all short links for a page
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

    const pageId = request.nextUrl.searchParams.get('pageId')
    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        workspace: {
          select: {
            members: {
              where: { userId: user.id },
              select: { id: true },
            },
          },
        },
      },
    })

    if (!page || page.workspace.members.length === 0) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    const shortLinks = await getPageShortLinks(pageId)

    return NextResponse.json({ shortLinks })
  } catch (error) {
    console.error('Error fetching short links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch short links' },
      { status: 500 }
    )
  }
}
