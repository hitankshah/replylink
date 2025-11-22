import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export interface AnalyticsMetrics {
  totalViews: number
  totalClicks: number
  averageClickThroughRate: number
  topPages: Array<{
    id: string
    title: string
    views: number
    clicks: number
    ctr: number
  }>
  topButtons: Array<{
    id: string
    label: string
    clicks: number
    ctr: number
  }>
}

export interface TimeSeriesData {
  date: string
  views: number
  clicks: number
  ctr: number
}

export interface DeviceStats {
  desktop: number
  mobile: number
  tablet: number
  other: number
}

export interface ReferrerStats {
  referrer: string
  count: number
  percentage: number
}

/**
 * Get analytics summary for a workspace
 */
export async function getWorkspaceAnalytics(
  workspaceId: string,
  days: number = 30
): Promise<AnalyticsMetrics> {
  const cacheKey = `analytics:workspace:${workspaceId}:${days}d`
  const cached = await cache.get<AnalyticsMetrics>(cacheKey)
  if (cached) {
    return cached
  }

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Get all pages in workspace
  const pages = await prisma.linkPage.findMany({
    where: {
      user: {
        workspaces: {
          some: { workspaceId },
        },
      },
    },
    select: {
      id: true,
      title: true,
      views: true,
      buttons: {
        select: {
          id: true,
          label: true,
          clicks: true,
        },
      },
    },
  })

  // Calculate metrics
  const totalViews = pages.reduce((sum, p) => sum + p.views, 0)
  const totalClicks = pages.reduce(
    (sum, p) => sum + p.buttons.reduce((s, b) => s + b.clicks, 0),
    0
  )
  const averageClickThroughRate =
    totalViews > 0 ? (totalClicks / totalViews) * 100 : 0

  // Top pages
  const topPages = pages
    .map((p) => ({
      id: p.id,
      title: p.title,
      views: p.views,
      clicks: p.buttons.reduce((sum, b) => sum + b.clicks, 0),
      ctr: p.views > 0 ? ((p.buttons.reduce((sum, b) => sum + b.clicks, 0) / p.views) * 100) : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  // Top buttons
  const allButtons = pages.flatMap((p) =>
    p.buttons.map((b) => ({
      id: b.id,
      label: b.label,
      clicks: b.clicks,
      ctr: 0, // Calculated separately if needed
    }))
  )
  const topButtons = allButtons.sort((a, b) => b.clicks - a.clicks).slice(0, 10)

  const result: AnalyticsMetrics = {
    totalViews,
    totalClicks,
    averageClickThroughRate,
    topPages,
    topButtons,
  }

  // Cache for 1 hour
  await cache.set(cacheKey, result, { ttl: 3600 })

  return result
}

/**
 * Get page analytics
 */
export async function getPageAnalytics(pageId: string) {
  const cacheKey = `analytics:page:${pageId}`
  const cached = await cache.get<any>(cacheKey)
  if (cached) {
    return cached
  }

  const page = await prisma.linkPage.findUnique({
    where: { id: pageId },
    select: {
      id: true,
      title: true,
      views: true,
      buttons: {
        select: {
          id: true,
          label: true,
          type: true,
          clicks: true,
        },
      },
    },
  })

  if (!page) {
    return null
  }

  const totalClicks = page.buttons.reduce((sum, b) => sum + b.clicks, 0)
  const ctr = page.views > 0 ? (totalClicks / page.views) * 100 : 0

  const result = {
    pageId: page.id,
    title: page.title,
    totalViews: page.views,
    totalClicks,
    ctr,
    buttons: page.buttons.map((b) => ({
      ...b,
      percentage: totalClicks > 0 ? (b.clicks / totalClicks) * 100 : 0,
    })),
  }

  // Cache for 30 minutes
  await cache.set(cacheKey, result, { ttl: 1800 })

  return result
}

/**
 * Get button analytics
 */
export async function getButtonAnalytics(buttonId: string) {
  const cacheKey = `analytics:button:${buttonId}`
  const cached = await cache.get<any>(cacheKey)
  if (cached) {
    return cached
  }

  const button = await prisma.linkButton.findUnique({
    where: { id: buttonId },
    select: {
      id: true,
      label: true,
      clicks: true,
      page: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  })

  if (!button) {
    return null
  }

  const ctr =
    button.page.views > 0
      ? (button.clicks / button.page.views) * 100
      : 0

  const result = {
    buttonId: button.id,
    label: button.label,
    clicks: button.clicks,
    pageViews: button.page.views,
    ctr,
    pageTitle: button.page.title,
    pageId: button.page.id,
  }

  // Cache for 30 minutes
  await cache.set(cacheKey, result, { ttl: 1800 })

  return result
}

/**
 * Increment page views
 */
export async function incrementPageViews(pageId: string): Promise<void> {
  try {
    await prisma.linkPage.update({
      where: { id: pageId },
      data: { views: { increment: 1 } },
    })

    // Invalidate cache
    await cache.del(`analytics:page:${pageId}`)
  } catch (error) {
    console.error('Error incrementing page views:', error)
  }
}

/**
 * Increment button clicks
 */
export async function incrementButtonClicks(buttonId: string): Promise<void> {
  try {
    const button = await prisma.linkButton.update({
      where: { id: buttonId },
      data: { clicks: { increment: 1 } },
      select: { pageId: true },
    })

    // Invalidate caches
    await cache.del(`analytics:button:${buttonId}`)
    await cache.del(`analytics:page:${button.pageId}`)
  } catch (error) {
    console.error('Error incrementing button clicks:', error)
  }
}

/**
 * Get device breakdown for a page (stub for future implementation)
 */
export async function getDeviceStats(pageId: string): Promise<DeviceStats> {
  // This would require storing device info in analytics table
  // For now, returning placeholder data
  return {
    desktop: 65,
    mobile: 30,
    tablet: 4,
    other: 1,
  }
}

/**
 * Get referrer breakdown for a page (stub for future implementation)
 */
export async function getReferrerStats(
  pageId: string,
  limit: number = 10
): Promise<ReferrerStats[]> {
  // This would require storing referrer info in analytics table
  // For now, returning placeholder data
  return [
    { referrer: 'direct', count: 245, percentage: 35 },
    { referrer: 'instagram.com', count: 180, percentage: 26 },
    { referrer: 'twitter.com', count: 120, percentage: 17 },
    { referrer: 'facebook.com', count: 95, percentage: 14 },
    { referrer: 'other', count: 60, percentage: 8 },
  ]
}

/**
 * Export analytics as CSV
 */
export async function exportAnalyticsAsCSV(pageId: string): Promise<string> {
  const analytics = await getPageAnalytics(pageId)

  if (!analytics) {
    throw new Error('Page not found')
  }

  const headers = ['Button Label', 'Clicks', 'Percentage']
  const rows = analytics.buttons.map((b: any) => [
    b.label,
    b.clicks,
    b.percentage.toFixed(2) + '%',
  ])

  const csv = [
    ['Page Analytics Export'],
    ['Page:', analytics.title],
    ['Total Views:', analytics.totalViews],
    ['Total Clicks:', analytics.totalClicks],
    ['CTR:', analytics.ctr.toFixed(2) + '%'],
    [],
    headers,
    ...rows,
  ]
    .map((row) => row.join(','))
    .join('\n')

  return csv
}
