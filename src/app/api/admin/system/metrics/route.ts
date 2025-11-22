import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isWorkspaceAdmin } from '@/lib/middleware/workspace'

/**
 * GET /api/admin/system/metrics - System metrics and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin access
    const user = session.user as any
    const isGlobalAdmin = user.role === 'ADMIN'

    if (!isGlobalAdmin) {
      const workspaceId = user.workspaceId
      if (!workspaceId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get active users (logged in today)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: yesterday,
        },
      },
    })

    // Get total workspaces
    const totalWorkspaces = await prisma.workspace.count()

    // Get subscriptions
    const subscriptions = await prisma.subscription.findMany({
      select: {
        planType: true,
        status: true,
      },
    })

    const totalSubscriptions = subscriptions.length

    // Calculate monthly revenue
    const monthlyRevenue = subscriptions.reduce((sum, s) => {
      const prices: Record<string, number> = {
        FREE: 0,
        STARTER: 19,
        PRO: 49,
        AGENCY: 199,
      }
      const activeCount = s.status === 'active' ? 1 : 0
      return sum + prices[s.planType] * activeCount
    }, 0)

    // Get rule execution logs for events processed
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const eventsProcessedToday = await prisma.ruleExecutionLog.count({
      where: {
        executedAt: {
          gte: today,
        },
      },
    })

    const eventsProcessed = await prisma.ruleExecutionLog.count()

    const failedEvents = await prisma.ruleExecutionLog.count({
      where: {
        success: false,
      },
    })

    // Calculate average response time (mock - would come from actual metrics)
    const averageResponseTime = 145 // ms

    // Health status (would typically come from health checks)
    const databaseHealth = 'healthy' as const
    const cacheHealth = 'healthy' as const
    const queueHealth = 'healthy' as const

    const metrics = {
      totalUsers,
      activeUsers,
      totalWorkspaces,
      totalSubscriptions,
      monthlyRevenue,
      eventsProcessed,
      eventsProcessedToday,
      failedEvents,
      averageResponseTime,
      databaseHealth,
      cacheHealth,
      queueHealth,
      lastUpdate: new Date().toISOString(),
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
