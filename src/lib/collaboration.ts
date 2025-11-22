import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export enum CollaboratorRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
}

export interface Collaborator {
  id: string
  email: string
  name: string
  role: CollaboratorRole
  addedAt: Date
  lastActiveAt?: Date
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  changes?: Record<string, any>
  timestamp: Date
}

/**
 * Add collaborator to page
 */
export async function addCollaborator(
  pageId: string,
  email: string,
  role: CollaboratorRole = CollaboratorRole.VIEWER
): Promise<Collaborator> {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // In a real app, you'd create a proper collaborator model/table
  // For now, we'll use a simplified approach

  // Invalidate cache
  await cache.del(`collaborators:page:${pageId}`)

  return {
    id: user.id,
    email,
    name: user.name || 'Unknown',
    role,
    addedAt: new Date(),
  }
}

/**
 * Remove collaborator from page
 */
export async function removeCollaborator(pageId: string, userId: string): Promise<void> {
  // In production, delete from collaborator table
  console.log(`Removing collaborator ${userId} from page ${pageId}`)

  // Invalidate cache
  await cache.del(`collaborators:page:${pageId}`)
}

/**
 * Update collaborator role
 */
export async function updateCollaboratorRole(
  pageId: string,
  userId: string,
  role: CollaboratorRole
): Promise<Collaborator | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  })

  if (!user) {
    return null
  }

  // Invalidate cache
  await cache.del(`collaborators:page:${pageId}`)

  return {
    id: user.id,
    email: user.email,
    name: user.name || 'Unknown',
    role,
    addedAt: new Date(),
  }
}

/**
 * Get page collaborators
 */
export async function getPageCollaborators(pageId: string): Promise<Collaborator[]> {
  const cacheKey = `collaborators:page:${pageId}`
  const cached = await cache.get<Collaborator[]>(cacheKey)
  if (cached) {
    return cached
  }

  // In production, fetch from collaborator table
  // For now, return empty array
  const collaborators: Collaborator[] = []

  // Cache for 1 hour
  await cache.set(cacheKey, collaborators, { ttl: 3600 })

  return collaborators
}

/**
 * Check if user has permission to access page
 */
export async function hasPageAccess(
  pageId: string,
  userId: string,
  requiredRole: CollaboratorRole = CollaboratorRole.VIEWER
): Promise<boolean> {
  const page = await prisma.linkPage.findUnique({
    where: { id: pageId },
    select: { userId: true },
  })

  if (!page) {
    return false
  }

  // Owner has full access
  if (page.userId === userId) {
    return true
  }

  // Check collaborator role
  const collaborators = await getPageCollaborators(pageId)
  const collaborator = collaborators.find((c) => c.id === userId)

  if (!collaborator) {
    return false
  }

  // Role hierarchy: OWNER > EDITOR > VIEWER
  const roleHierarchy: Record<CollaboratorRole, number> = {
    [CollaboratorRole.OWNER]: 3,
    [CollaboratorRole.EDITOR]: 2,
    [CollaboratorRole.VIEWER]: 1,
  }

  return roleHierarchy[collaborator.role] >= roleHierarchy[requiredRole]
}

/**
 * Log activity/changes to page
 */
export async function logActivity(
  pageId: string,
  userId: string,
  action: string,
  changes?: Record<string, any>
): Promise<void> {
  try {
    // In production, store in activity_logs table
    console.log(`Activity: ${action}`, {
      pageId,
      userId,
      changes,
      timestamp: new Date(),
    })

    // Invalidate activity cache
    await cache.del(`activity:page:${pageId}`)
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

/**
 * Get activity history for a page
 */
export async function getActivityHistory(
  pageId: string,
  limit: number = 50
): Promise<ActivityLog[]> {
  const cacheKey = `activity:page:${pageId}`
  const cached = await cache.get<ActivityLog[]>(cacheKey)
  if (cached) {
    return cached.slice(0, limit)
  }

  // In production, fetch from activity_logs table
  // For now, return empty array
  const activities: ActivityLog[] = []

  // Cache for 1 hour
  await cache.set(cacheKey, activities, { ttl: 3600 })

  return activities.slice(0, limit)
}

/**
 * Get recent activity across all pages for a user
 */
export async function getUserActivity(
  userId: string,
  limit: number = 50
): Promise<ActivityLog[]> {
  const cacheKey = `activity:user:${userId}`
  const cached = await cache.get<ActivityLog[]>(cacheKey)
  if (cached) {
    return cached.slice(0, limit)
  }

  // In production, fetch from activity_logs table where userId matches
  const activities: ActivityLog[] = []

  // Cache for 30 minutes
  await cache.set(cacheKey, activities, { ttl: 1800 })

  return activities.slice(0, limit)
}

/**
 * Add comment to page
 */
export async function addComment(
  pageId: string,
  userId: string,
  text: string
): Promise<any> {
  // In production, create comment in comments table
  const comment = {
    id: 'comment_' + Date.now(),
    pageId,
    userId,
    text,
    createdAt: new Date(),
  }

  // Invalidate cache
  await cache.del(`comments:page:${pageId}`)

  return comment
}

/**
 * Get page comments
 */
export async function getPageComments(pageId: string): Promise<any[]> {
  const cacheKey = `comments:page:${pageId}`
  const cached = await cache.get<any[]>(cacheKey)
  if (cached) {
    return cached
  }

  // In production, fetch from comments table
  const comments: any[] = []

  // Cache for 1 hour
  await cache.set(cacheKey, comments, { ttl: 3600 })

  return comments
}

/**
 * Send notification to collaborators
 */
export async function notifyCollaborators(
  pageId: string,
  message: string,
  excludeUserId?: string
): Promise<void> {
  const collaborators = await getPageCollaborators(pageId)

  for (const collaborator of collaborators) {
    if (excludeUserId && collaborator.id === excludeUserId) {
      continue
    }

    // In production, send email or push notification
    console.log(`Notifying ${collaborator.email}: ${message}`)
  }
}
