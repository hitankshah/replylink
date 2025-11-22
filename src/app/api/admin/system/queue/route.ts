import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isWorkspaceAdmin } from '@/lib/middleware/workspace'
import { webhookQueue, replyQueue } from '@/lib/queues'

/**
 * GET /api/admin/system/queue - Queue statistics
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

    // Get stats from both queues
    const [webhookStats, replyStats] = await Promise.all([
      webhookQueue.getJobCounts(),
      replyQueue.getJobCounts(),
    ])

    // Combine stats
    const stats = {
      pendingJobs:
        (webhookStats.wait || 0) +
        (webhookStats.waiters || 0) +
        (replyStats.wait || 0) +
        (replyStats.waiters || 0),
      processingJobs: (webhookStats.active || 0) + (replyStats.active || 0),
      completedJobs: (webhookStats.completed || 0) + (replyStats.completed || 0),
      failedJobs: (webhookStats.failed || 0) + (replyStats.failed || 0),
      delayedJobs: (webhookStats.delayed || 0) + (replyStats.delayed || 0),
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching queue stats:', error)
    // Return mock data if queues not available
    return NextResponse.json({
      stats: {
        pendingJobs: 0,
        processingJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
        delayedJobs: 0,
      },
    })
  }
}
