import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch reply executions grouped by platform
        const ruleExecutions = await prisma.ruleExecutionLog.findMany({
            where: {
                rule: {
                    userId: user.id,
                },
            },
            select: {
                rule: {
                    select: {
                        platform: true,
                    },
                },
            },
        })

        // Group by platform
        const grouped: Record<string, number> = {
            Instagram: 0,
            Facebook: 0,
            WhatsApp: 0,
            Other: 0,
        }

        ruleExecutions.forEach((exec) => {
            const platform = exec.rule.platform || 'Other'
            if (platform in grouped) {
                grouped[platform as keyof typeof grouped]++
            } else {
                grouped.Other++
            }
        })

        const data = Object.entries(grouped)
            .filter(([_, value]) => value > 0)
            .map(([name, value]) => ({ name, value }))

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Reply usage error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch reply usage' },
            { status: 500 }
        )
    }
}
