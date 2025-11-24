import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMIT_CONFIG: Record<string, RateLimitConfig> = {
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000,
  },
  free: {
    maxRequests: 100,
    windowMs: 60 * 60 * 1000,
  },
  starter: {
    maxRequests: 500,
    windowMs: 60 * 60 * 1000,
  },
  pro: {
    maxRequests: 1000,
    windowMs: 60 * 60 * 1000,
  },
  premium: {
    maxRequests: 10000,
    windowMs: 60 * 60 * 1000,
  },
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.ip || 'unknown'
}

function createRateLimitKey(identifier: string, window: number): string {
  const windowStart = Math.floor(Date.now() / window) * window
  return `rate-limit:${identifier}:${windowStart}`
}

export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    // If Redis is not available, allow all requests in development
    if (!redis) {
      if (process.env.NODE_ENV === 'development') {
        return {
          allowed: true,
          remaining: config.maxRequests,
          reset: Date.now() + config.windowMs,
        }
      }
      throw new Error('Redis is required for rate limiting in production')
    }

    const ip = getClientIP(request)
    const key = createRateLimitKey(identifier || ip, config.windowMs)

    const count = await redis.incr(key)

    if (count === 1) {
      await redis.expire(key, Math.ceil(config.windowMs / 1000))
    }

    const allowed = count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - count)
    const reset = Date.now() + config.windowMs

    return { allowed, remaining, reset }
  } catch (error) {
    console.error('Rate limit check error:', error)
    // Allow request on error to prevent blocking users
    return { allowed: true, remaining: config.maxRequests, reset: Date.now() + config.windowMs }
  }
}

export async function authRateLimit(request: NextRequest) {
  const config = RATE_LIMIT_CONFIG.auth
  const result = await checkRateLimit(request, config)

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'Too many authentication attempts',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
          },
        }
      ),
    }
  }

  return { allowed: true, response: null }
}

export async function apiRateLimit(
  request: NextRequest,
  planType: 'free' | 'starter' | 'pro' | 'premium' = 'free'
) {
  const config = RATE_LIMIT_CONFIG[planType] || RATE_LIMIT_CONFIG.free
  const userId = request.headers.get('x-user-id') || 'anonymous'
  const result = await checkRateLimit(request, config, userId)

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: 'API rate limit exceeded',
          message: `You have exceeded the rate limit of ${config.maxRequests} requests per hour`,
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
            'X-RateLimit-Plan': planType,
          },
        }
      ),
    }
  }

  return { allowed: true, response: null }
}

export async function resetRateLimit(identifier: string): Promise<boolean> {
  try {
    const pattern = `rate-limit:${identifier}:*`
    const keys = await redis.keys(pattern)

    if (keys.length > 0) {
      await redis.del(...keys)
    }

    return true
  } catch (error) {
    console.error('Rate limit reset error:', error)
    return false
  }
}

export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<{ used: number; remaining: number; resetAt: Date }> {
  try {
    const key = createRateLimitKey(identifier, config.windowMs)
    const used = parseInt((await redis.get(key)) || '0', 10)
    const ttl = await redis.ttl(key)

    const remaining = Math.max(0, config.maxRequests - used)
    const resetAt = new Date(Date.now() + (ttl > 0 ? ttl * 1000 : config.windowMs))

    return { used, remaining, resetAt }
  } catch (error) {
    console.error('Get rate limit status error:', error)
    return {
      used: 0,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.windowMs),
    }
  }
}
