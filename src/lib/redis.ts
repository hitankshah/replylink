import Redis from 'ioredis'

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL
    }
    // Return null in development if Redis is not configured
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Redis not configured - using in-memory fallback')
        return null
    }
    throw new Error('REDIS_URL is not defined')
}

const redisUrl = getRedisUrl()

// Create Redis instance only if URL is provided
const redis = redisUrl ? new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 3) {
            console.error('❌ Redis connection failed after 3 retries')
            return null // Stop retrying
        }
        return Math.min(times * 100, 3000)
    },
    lazyConnect: true, // Don't connect immediately
}) : null

if (redis) {
    redis.on('error', (error) => {
        console.error('Redis connection error:', error.message)
    })

    redis.on('connect', () => {
        console.log('✅ Redis connected successfully')
    })

    // Attempt to connect
    redis.connect().catch(err => {
        console.error('Failed to connect to Redis:', err.message)
    })
}

export default redis

