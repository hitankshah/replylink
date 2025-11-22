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

        // Fetch real data from database
        const [pageViewsData, buttonClicksData, monthlyUsageData] = await Promise.all([
            // Page views
            prisma.pageView.aggregate({
                where: {
                    linkPage: {
                        userId: user.id,
                    },
                    createdAt: {
                        gte: startDate,
                        lte: now,
                    },
                },
                _count: true,
            }),
            // Button clicks
            prisma.buttonClick.aggregate({
                where: {
                    button: {
                        linkPage: {
                            userId: user.id,
                        },
                    },
                    createdAt: {
                        gte: startDate,
                        lte: now,
                    },
                },
                _count: true,
            }),
            // Monthly usage for remaining replies
            prisma.monthlyUsage.findFirst({
                where: {
                    userId: user.id,
                    month: new Date(now.getFullYear(), now.getMonth(), 1),
                },
            }),
        ])

        // Calculate remaining replies
        const repliesSent = monthlyUsageData?.repliesUsed || 0
        const monthlyLimit = user.subscription?.plan === 'ENTERPRISE' 
            ? 100000 
            : user.subscription?.plan === 'PRO' 
            ? 50000 
            : 1000
        const remainingReplies = Math.max(0, monthlyLimit - repliesSent)

        const stats = {
            pageViews: pageViewsData._count,
            buttonClicks: buttonClicksData._count,
            repliesSent,
            remainingReplies,
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Dashboard stats error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        )
    }
}
