import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    database: { status: 'up' | 'down'; latency: number }
    redis: { status: 'up' | 'down'; latency: number }
    queue: { status: 'up' | 'down'; latency: number }
  }
  uptime: number
}

export async function GET() {
  const startTime = Date.now()
  const checks = {
    database: { status: 'down' as const, latency: 0 },
    redis: { status: 'down' as const, latency: 0 },
    queue: { status: 'down' as const, latency: 0 },
  }

  // Check database
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    checks.database = {
      status: 'up',
      latency: Date.now() - dbStart,
    }
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  // Check Redis
  try {
    const redisStart = Date.now()
    await redis.ping()
    checks.redis = {
      status: 'up',
      latency: Date.now() - redisStart,
    }
  } catch (error) {
    console.error('Redis health check failed:', error)
  }

  // Check job queue (BullMQ via Redis)
  try {
    const queueStart = Date.now()
    // The queue health is dependent on Redis, so if Redis is up, queue is up
    if (checks.redis.status === 'up') {
      checks.queue = {
        status: 'up',
        latency: Date.now() - queueStart,
      }
    }
  } catch (error) {
    console.error('Queue health check failed:', error)
  }

  // Determine overall status
  const failedChecks = Object.values(checks).filter((c) => c.status === 'down').length
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

  if (failedChecks === 0) {
    status = 'healthy'
  } else if (failedChecks === 1) {
    status = 'degraded'
  } else {
    status = 'unhealthy'
  }

  const uptime = process.uptime()

  const response: HealthStatus = {
    status,
    timestamp: new Date().toISOString(),
    checks,
    uptime,
  }

  // Return appropriate status code
  const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 503 : 503

  return NextResponse.json(response, { status: statusCode })
}
