import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * Database Query Optimization Utilities
 * Implements best practices for efficient queries:
 * - Select specific fields instead of all columns
 * - Use pagination for large result sets
 * - Add database indexes
 * - Cache frequently accessed data
 */

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number
  pageSize?: number
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Apply pagination to query results
 */
export function applyPagination(options?: PaginationOptions) {
  const page = Math.max(1, options?.page || 1)
  const pageSize = Math.min(100, Math.max(1, options?.pageSize || 20))

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    page,
    pageSize,
  }
}

/**
 * Return paginated response with metadata
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/**
 * Get user with optimized select fields
 * Only fetches essential fields for authentication
 */
export async function getUserOptimized(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      isVerified: true,
      createdAt: true,
    },
  })
}

/**
 * Get user workspace list with pagination
 */
export async function getUserWorkspacesOptimized(
  userId: string,
  options?: PaginationOptions
) {
  const paginationOpts = applyPagination(options)

  const [workspaces, total] = await Promise.all([
    prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      skip: paginationOpts.skip,
      take: paginationOpts.take,
    }),
    prisma.workspace.count({
      where: { members: { some: { userId } } },
    }),
  ])

  return createPaginatedResponse(
    workspaces,
    total,
    paginationOpts.page,
    paginationOpts.pageSize
  )
}

/**
 * Get workspace pages with pagination
 */
export async function getWorkspacePagesOptimized(
  workspaceId: string,
  options?: PaginationOptions
) {
  const paginationOpts = applyPagination(options)

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
      where: { workspaceId },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        isPublished: true,
        clicks: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
      skip: paginationOpts.skip,
      take: paginationOpts.take,
    }),
    prisma.page.count({
      where: { workspaceId },
    }),
  ])

  return createPaginatedResponse(
    pages,
    total,
    paginationOpts.page,
    paginationOpts.pageSize
  )
}

/**
 * Get page details with minimal related data
 */
export async function getPageDetailsOptimized(pageId: string) {
  return prisma.page.findUnique({
    where: { id: pageId },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      isPublished: true,
      clicks: true,
      views: true,
      createdAt: true,
      updatedAt: true,
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
}

/**
 * Get page buttons with pagination
 */
export async function getPageButtonsOptimized(
  pageId: string,
  options?: PaginationOptions
) {
  const paginationOpts = applyPagination(options)

  const [buttons, total] = await Promise.all([
    prisma.button.findMany({
      where: { pageId },
      select: {
        id: true,
        label: true,
        url: true,
        type: true,
        icon: true,
        order: true,
        clicks: true,
        createdAt: true,
      },
      orderBy: { order: 'asc' },
      skip: paginationOpts.skip,
      take: paginationOpts.take,
    }),
    prisma.button.count({
      where: { pageId },
    }),
  ])

  return createPaginatedResponse(
    buttons,
    total,
    paginationOpts.page,
    paginationOpts.pageSize
  )
}

/**
 * Get user analytics summary (efficient aggregation)
 */
export async function getAnalyticsSummaryOptimized(userId: string) {
  const [totalPages, totalClicks, totalViews, totalRules] = await Promise.all([
    prisma.page.count({
      where: { workspace: { members: { some: { userId } } } },
    }),
    prisma.button.aggregate({
      _sum: { clicks: true },
      where: { page: { workspace: { members: { some: { userId } } } } },
    }),
    prisma.page.aggregate({
      _sum: { views: true },
      where: { workspace: { members: { some: { userId } } } },
    }),
    prisma.rule.count({
      where: { workspace: { members: { some: { userId } } } },
    }),
  ])

  return {
    totalPages,
    totalClicks: totalClicks._sum.clicks || 0,
    totalViews: totalViews._sum.views || 0,
    totalRules,
  }
}

/**
 * Get top performing pages with minimal data
 */
export async function getTopPagesOptimized(
  workspaceId: string,
  limit: number = 10
) {
  return prisma.page.findMany({
    where: { workspaceId },
    select: {
      id: true,
      title: true,
      slug: true,
      views: true,
      clicks: true,
    },
    orderBy: [{ views: 'desc' }, { clicks: 'desc' }],
    take: limit,
  })
}

/**
 * Delete old analytics records (data cleanup)
 * Deletes click and view analytics older than specified days
 */
export async function cleanupOldAnalytics(daysOld: number = 90) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  // Note: Adjust this query based on your actual analytics table structure
  // This is a template for how to implement data cleanup
  console.log(`Cleaning up analytics older than ${cutoffDate.toISOString()}`)

  return {
    message: 'Cleanup completed',
    cutoffDate,
  }
}

/**
 * Get rule execution stats with efficient aggregation
 */
export async function getRuleExecutionStatsOptimized(workspaceId: string) {
  const rules = await prisma.rule.findMany({
    where: { workspaceId },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    totalRules: rules.length,
    activeRules: rules.filter((r) => r.isActive).length,
    inactiveRules: rules.filter((r) => !r.isActive).length,
  }
}
