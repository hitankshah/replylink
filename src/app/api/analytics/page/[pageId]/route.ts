import { NextRequest, NextResponse } from 'next/server'
import {
  getPageAnalytics,
  getButtonAnalytics,
  getDeviceStats,
  getReferrerStats,
  exportAnalyticsAsCSV,
} from '@/lib/analytics'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/analytics/page/[pageId]
 * Get analytics for a specific page
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
    const format = request.nextUrl.searchParams.get('format')
    const includeDevices = request.nextUrl.searchParams.get('devices') === 'true'
    const includeReferrers = request.nextUrl.searchParams.get('referrers') === 'true'

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: {
        userId: true,
      },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    const analytics = await getPageAnalytics(pageId)

    if (!analytics) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Add optional data
    if (includeDevices) {
      const deviceStats = await getDeviceStats(pageId)
      ;(analytics as any).devices = deviceStats
    }

    if (includeReferrers) {
      const referrerStats = await getReferrerStats(pageId)
      ;(analytics as any).referrers = referrerStats
    }

    // Export as CSV if requested
    if (format === 'csv') {
      const csv = await exportAnalyticsAsCSV(pageId)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="analytics.csv"',
        },
      })
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
