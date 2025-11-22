import { NextRequest, NextResponse } from 'next/server'
import {
  addCustomDomain,
  removeCustomDomain,
  getDomainConfig,
  getDNSRecordsForDomain,
  verifyDNS,
  verifySSL,
} from '@/lib/customDomain'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/domains
 * Add custom domain to page
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
    const { pageId, domain } = body

    if (!pageId || !domain) {
      return NextResponse.json(
        { error: 'pageId and domain are required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    // Add custom domain
    const config = await addCustomDomain(pageId, domain)

    // Start background verification
    // In production, you'd queue this as a job
    verifyDNS(domain).catch(console.error)
    verifySSL(domain).catch(console.error)

    return NextResponse.json(config, { status: 201 })
  } catch (error) {
    console.error('Domain setup error:', error)
    const message = error instanceof Error ? error.message : 'Failed to setup domain'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

/**
 * GET /api/domains/[pageId]
 * Get domain configuration for a page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const pageId = params.pageId

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    const config = await getDomainConfig(pageId)

    if (!config) {
      return NextResponse.json(
        { error: 'No custom domain configured' },
        { status: 404 }
      )
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching domain config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch domain config' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/domains/[pageId]
 * Remove custom domain from page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const pageId = params.pageId

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    await removeCustomDomain(pageId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Domain removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove domain' },
      { status: 500 }
    )
  }
}
