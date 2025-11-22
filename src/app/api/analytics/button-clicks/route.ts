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

        // Fetch button clicks from database
        const buttonClicks = await prisma.buttonClick.findMany({
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
            select: {
                button: {
                    select: {
                        type: true,
                    },
                },
            },
        })

        // Group by button type
        const grouped: Record<string, number> = {
            Instagram: 0,
            Facebook: 0,
            WhatsApp: 0,
            Email: 0,
            Other: 0,
        }

        buttonClicks.forEach((click) => {
            const type = click.button.type || 'Other'
            if (type in grouped) {
                grouped[type as keyof typeof grouped]++
            } else {
                grouped.Other++
            }
        })

        const data = Object.entries(grouped)
            .filter(([_, clicks]) => clicks > 0)
            .map(([name, clicks]) => ({ name, clicks }))

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Button clicks error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch button clicks' },
            { status: 500 }
        )
    }
}
