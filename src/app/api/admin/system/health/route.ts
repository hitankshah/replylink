import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isWorkspaceAdmin } from '@/lib/middleware/workspace'

/**
 * GET /api/admin/system/health - Service health check
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

    // Check database health
    let databaseHealthy = true
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch {
      databaseHealthy = false
    }

    // Check Redis health (would require redis client)
    let redisHealthy = true
    try {
      // In real implementation, connect to Redis and ping
      // const result = await redis.ping()
      // redisHealthy = result === 'PONG'
    } catch {
      redisHealthy = false
    }

    // Check message queue health
    let queueHealthy = true
    try {
      // In real implementation, check BullMQ queue
      // const queue = new Queue('webhook', { connection: redis })
      // const counts = await queue.getJobCounts()
    } catch {
      queueHealthy = false
    }

    // Check external APIs (mock)
    let externalAPIsHealthy = true

    const health = {
      database: databaseHealthy,
      redis: redisHealthy,
      messageQueue: queueHealthy,
      externalAPIs: externalAPIsHealthy,
    }

    return NextResponse.json({ health })
  } catch (error) {
    console.error('Error checking health:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
