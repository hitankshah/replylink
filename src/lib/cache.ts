import redis from '@/lib/redis'

interface CacheOptions {
  ttl?: number
  prefix?: string
}

const DEFAULT_TTL = 60 * 60 // 1 hour
const DEFAULT_PREFIX = 'cache:'

class Cache {
  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    try {
      if (!redis) return null // Skip caching if Redis not available

      const prefixedKey = this.getPrefixedKey(key, options?.prefix)
      const value = await redis.get(prefixedKey)

      if (!value) {
        return null
      }

      return JSON.parse(value) as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<boolean> {
    try {
      if (!redis) return false // Skip caching if Redis not available

      const prefixedKey = this.getPrefixedKey(key, options?.prefix)
      const ttl = options?.ttl || DEFAULT_TTL
      const stringValue = JSON.stringify(value)

      if (ttl > 0) {
        await redis.setex(prefixedKey, ttl, stringValue)
      } else {
        await redis.set(prefixedKey, stringValue)
      }

      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  async del(key: string, options?: CacheOptions): Promise<boolean> {
    try {
      if (!redis) return false
      const prefixedKey = this.getPrefixedKey(key, options?.prefix)
      await redis.del(prefixedKey)
      return true
    } catch (error) {
      console.error('Cache del error:', error)
      return false
    }
  }

  async delPattern(pattern: string, options?: CacheOptions): Promise<number> {
    try {
      if (!redis) return 0
      const prefixedPattern = this.getPrefixedKey(pattern, options?.prefix)
      const keys = await redis.keys(prefixedPattern)

      if (keys.length === 0) {
        return 0
      }

      await redis.del(...keys)
      return keys.length
    } catch (error) {
      console.error('Cache delPattern error:', error)
      return 0
    }
  }

  async clear(options?: CacheOptions): Promise<boolean> {
    try {
      const pattern = this.getPrefixedKey('*', options?.prefix)
      await this.delPattern(pattern, options)
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
      return false
    }
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key, options)

      if (cached) {
        return cached
      }

      const value = await fetcher()
      await this.set(key, value, options)
      return value
    } catch (error) {
      console.error('Cache getOrSet error:', error)
      return await fetcher()
    }
  }

  private getPrefixedKey(key: string, prefix?: string): string {
    const finalPrefix = prefix || DEFAULT_PREFIX
    return `${finalPrefix}${key}`
  }
}

export const cache = new Cache()

// Cache key generators for common entities
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userWorkspaces: (userId: string) => `user:${userId}:workspaces`,
  workspace: (workspaceId: string) => `workspace:${workspaceId}`,
  workspaceMembers: (workspaceId: string) => `workspace:${workspaceId}:members`,
  page: (pageId: string) => `page:${pageId}`,
  userPages: (userId: string) => `user:${userId}:pages`,
  button: (buttonId: string) => `button:${buttonId}`,
  pageButtons: (pageId: string) => `page:${pageId}:buttons`,
  rule: (ruleId: string) => `rule:${ruleId}`,
  userRules: (userId: string) => `user:${userId}:rules`,
  subscription: (userId: string) => `subscription:${userId}`,
  socialAccount: (accountId: string) => `social-account:${accountId}`,
  publicPage: (username: string) => `public-page:${username}`,
}

// Cache TTL presets
export const cacheTTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
}
