import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch social accounts
        const accounts = await prisma.socialAccount.findMany({
            where: {
                userId: user.id,
            },
            include: {
                _count: {
                    select: {
                        rules: true,
                    },
                },
            },
        })

        // Fetch rule execution counts by platform
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
                        name: true,
                    },
                },
            },
        })

        // Group platforms
        const platformMap: Record<string, { platform: string; accounts: number; replies: number; topRule: string }> = {}

        accounts.forEach((account) => {
            const platform = account.platform
            if (!platformMap[platform]) {
                platformMap[platform] = {
                    platform,
                    accounts: 0,
                    replies: 0,
                    topRule: 'N/A',
                }
            }
            platformMap[platform].accounts++
        })

        // Count replies by platform
        ruleExecutions.forEach((exec) => {
            const platform = exec.rule.platform
            if (platformMap[platform]) {
                platformMap[platform].replies++
                if (platformMap[platform].topRule === 'N/A') {
                    platformMap[platform].topRule = exec.rule.name
                }
            }
        })

        const data = Object.values(platformMap).filter((p) => p.accounts > 0)

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Platform stats error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch platform stats' },
            { status: 500 }
        )
    }
}
