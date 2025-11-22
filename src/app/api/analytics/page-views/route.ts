import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const days = parseInt(searchParams.get('days') || '7')

        const now = new Date()
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

        // Fetch page views from database
        const pageViews = await prisma.pageView.findMany({
            where: {
                linkPage: {
                    userId: user.id,
                },
                createdAt: {
                    gte: startDate,
                    lte: now,
                },
            },
            select: {
                createdAt: true,
            },
        })

        // Group by day
        const grouped: Record<string, number> = {}
        pageViews.forEach((view) => {
            const date = view.createdAt.toLocaleDateString('en-US', { weekday: 'short' })
            grouped[date] = (grouped[date] || 0) + 1
        })

        // Generate labels
        const labels = days === 7
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)

        const data = labels.map((name) => ({
            name,
            views: grouped[name] || 0,
        }))

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Page views error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch page views' },
            { status: 500 }
        )
    }
}
