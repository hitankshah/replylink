import { NextRequest, NextResponse } from 'next/server'
import { resolveShortLink, trackShortLinkClick } from '@/lib/shortLink'

/**
 * GET /api/short-links/[slug]
 * Redirect to the target URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    // Resolve the short link
    const targetUrl = await resolveShortLink(slug)

    if (!targetUrl) {
      return NextResponse.json(
        { error: 'Short link not found' },
        { status: 404 }
      )
    }

    // Track the click
    const referrer = request.headers.get('referer') || undefined
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'

    await trackShortLinkClick(slug, referrer, userAgent, ipAddress)

    // Redirect to target URL
    return NextResponse.redirect(targetUrl, {
      status: 302,
    })
  } catch (error) {
    console.error('Short link redirect error:', error)
    return NextResponse.json(
      { error: 'Failed to resolve short link' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/short-links/[slug]
 * Delete a short link
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { verifyToken } = await import('@/lib/auth')
    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { prisma } = await import('@/lib/prisma')
    const slug = params.slug

    // Verify ownership
    const shortLink = await prisma.shortLink.findUnique({
      where: { slug },
      select: {
        page: {
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
        },
      },
    })

    if (!shortLink || shortLink.page.workspace.members.length === 0) {
      return NextResponse.json(
        { error: 'Short link not found or unauthorized' },
        { status: 404 }
      )
    }

    const { deleteShortLink } = await import('@/lib/shortLink')
    await deleteShortLink(slug)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Short link deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete short link' },
      { status: 500 }
    )
  }
}
