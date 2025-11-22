import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

const BASE_URL = process.env.NEXT_PUBLIC_SHORT_URL || 'https://rpl.ink'

/**
 * Generate a short slug (6 characters)
 */
export function generateShortSlug(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let slug = ''

  for (let i = 0; i < 6; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return slug
}

/**
 * Create a short link
 */
export async function createShortLink(
  targetUrl: string,
  pageId: string,
  buttonId?: string,
  customSlug?: string
): Promise<{
  shortUrl: string
  slug: string
  targetUrl: string
}> {
  let slug = customSlug

  // Generate unique slug if not provided
  if (!slug) {
    let isUnique = false
    while (!isUnique) {
      slug = generateShortSlug()
      const existing = await prisma.shortLink.findUnique({
        where: { slug },
      })
      if (!existing) {
        isUnique = true
      }
    }
  } else {
    // Verify custom slug is unique
    const existing = await prisma.shortLink.findUnique({
      where: { slug },
    })
    if (existing) {
      throw new Error('Slug already in use')
    }
  }

  // Create short link record
  const shortLink = await prisma.shortLink.create({
    data: {
      slug,
      targetUrl,
      pageId,
      buttonId,
      clicks: 0,
    },
  })

  const shortUrl = `${BASE_URL}/${slug}`

  // Cache the mapping
  await cache.set(`shortlink:${slug}`, targetUrl, { ttl: 86400 * 30 })

  return {
    shortUrl,
    slug,
    targetUrl,
  }
}

/**
 * Resolve a short link
 */
export async function resolveShortLink(slug: string): Promise<string | null> {
  // Try cache first
  const cached = await cache.get<string>(`shortlink:${slug}`)
  if (cached) {
    return cached
  }

  // Query database
  const shortLink = await prisma.shortLink.findUnique({
    where: { slug },
    select: { targetUrl: true },
  })

  if (!shortLink) {
    return null
  }

  // Cache for future use
  await cache.set(`shortlink:${slug}`, shortLink.targetUrl, { ttl: 86400 * 30 })

  return shortLink.targetUrl
}

/**
 * Track click on short link
 */
export async function trackShortLinkClick(
  slug: string,
  referrer?: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  try {
    const shortLink = await prisma.shortLink.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!shortLink) {
      return
    }

    // Increment click count
    await prisma.shortLink.update({
      where: { slug },
      data: {
        clicks: { increment: 1 },
        lastClickedAt: new Date(),
      },
    })

    // Record click event if tracking enabled
    // This can be expanded to store detailed analytics
    if (referrer || userAgent || ipAddress) {
      // Future: Store in analytics table
      console.log(`Short link click tracked: ${slug}`)
    }
  } catch (error) {
    console.error('Error tracking short link click:', error)
  }
}

/**
 * Get short link stats
 */
export async function getShortLinkStats(slug: string) {
  const shortLink = await prisma.shortLink.findUnique({
    where: { slug },
    select: {
      slug: true,
      targetUrl: true,
      clicks: true,
      createdAt: true,
      lastClickedAt: true,
      page: {
        select: {
          id: true,
          title: true,
        },
      },
      button: {
        select: {
          id: true,
          label: true,
        },
      },
    },
  })

  if (!shortLink) {
    return null
  }

  return {
    ...shortLink,
    shortUrl: `${BASE_URL}/${slug}`,
  }
}

/**
 * Get all short links for a page
 */
export async function getPageShortLinks(pageId: string) {
  const shortLinks = await prisma.shortLink.findMany({
    where: { pageId },
    select: {
      slug: true,
      targetUrl: true,
      clicks: true,
      createdAt: true,
      lastClickedAt: true,
      button: {
        select: {
          label: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return shortLinks.map((link) => ({
    ...link,
    shortUrl: `${BASE_URL}/${link.slug}`,
  }))
}

/**
 * Delete a short link
 */
export async function deleteShortLink(slug: string): Promise<void> {
  await prisma.shortLink.delete({
    where: { slug },
  })

  // Invalidate cache
  await cache.del(`shortlink:${slug}`)
}

/**
 * Update short link target URL
 */
export async function updateShortLinkTarget(
  slug: string,
  newTargetUrl: string
): Promise<void> {
  await prisma.shortLink.update({
    where: { slug },
    data: { targetUrl: newTargetUrl },
  })

  // Invalidate cache
  await cache.del(`shortlink:${slug}`)
}
