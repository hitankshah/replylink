import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export interface WorkspaceContext {
  workspaceId: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
}

/**
 * Extract workspace context from request headers
 * Expected headers: x-workspace-id, x-user-id, x-user-role
 */
export async function getWorkspaceContext(): Promise<WorkspaceContext | null> {
  try {
    const headersList = await headers()
    const workspaceId = headersList.get('x-workspace-id')
    const userId = headersList.get('x-user-id')
    const role = headersList.get('x-user-role')

    if (!workspaceId || !userId || !role) {
      return null
    }

    return {
      workspaceId,
      userId,
      role: role as 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER',
    }
  } catch {
    return null
  }
}

/**
 * Verify user has access to workspace
 * Returns workspace data if valid, null otherwise
 */
export async function verifyWorkspaceAccess(
  workspaceId: string,
  userId: string,
  requiredRole?: 'owner' | 'admin' | 'member' | 'guest'
) {
  try {
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
      },
      include: {
        workspace: true,
      },
    })

    if (!membership) {
      return null
    }

    // Check role requirement
    if (requiredRole) {
      const roleHierarchy = { guest: 0, member: 1, admin: 2, owner: 3 }
      if (
        roleHierarchy[membership.role as keyof typeof roleHierarchy] <
        roleHierarchy[requiredRole]
      ) {
        return null
      }
    }

    return membership.workspace
  } catch {
    return null
  }
}

/**
 * Get user's workspaces with membership info
 */
export async function getUserWorkspaces(userId: string) {
  try {
    return await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            _count: {
              select: { members: true },
            },
          },
        },
      },
    })
  } catch {
    return []
  }
}

/**
 * Add workspace filter to Prisma query
 * Ensures data isolation by workspace
 */
export function withWorkspaceFilter<T extends Record<string, any>>(
  query: T,
  workspaceId: string
): T & { workspaceId: string } {
  return {
    ...query,
    workspaceId,
  }
}

/**
 * Verify multiple workspaces belong to user
 */
export async function verifyWorkspaceOwnership(
  workspaceIds: string[],
  userId: string
): Promise<boolean> {
  try {
    const count = await prisma.workspaceMember.count({
      where: {
        workspaceId: { in: workspaceIds },
        userId,
      },
    })
    return count === workspaceIds.length
  } catch {
    return false
  }
}

/**
 * Set active workspace for user session
 * Returns updated user with activeWorkspaceId
 */
export async function setActiveWorkspace(userId: string, workspaceId: string) {
  try {
    // First verify user has access to this workspace
    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    })

    if (!membership) {
      return null
    }

    // Return workspace data (user doesn't have activeWorkspaceId field in schema)
    return await prisma.workspace.findUnique({
      where: { id: workspaceId },
    })
  } catch {
    return null
  }
}

/**
 * Get user's active workspace (first workspace they're member of)
 */
export async function getActiveWorkspace(userId: string) {
  try {
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId },
      include: { workspace: true },
    })

    if (!membership?.workspace) {
      return null
    }

    return await prisma.workspace.findUnique({
      where: { id: membership.workspace.id },
      include: {
        _count: {
          select: { members: true },
        },
      },
    })
  } catch {
    return null
  }
}

/**
 * Get workspace members with role and status
 */
export async function getWorkspaceMembers(workspaceId: string) {
  try {
    return await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
  } catch {
    return []
  }
}

/**
 * Invite user to workspace
 * Creates invitation and/or workspace member record
 */
export async function inviteToWorkspace(
  workspaceId: string,
  email: string,
  role: 'ADMIN' | 'MEMBER' | 'VIEWER',
  invitedByUserId: string
) {
  try {
    // Check if inviter has permission
    const inviter = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: invitedByUserId },
    })

    if (!inviter || !['OWNER', 'ADMIN'].includes(inviter.role)) {
      return null
    }

    // Check if user already exists in workspace
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspace: { id: workspaceId },
        user: { email },
      },
    })

    if (existingMember) {
      return { exists: true, member: existingMember }
    }

    // Check if user exists in system
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Add user directly to workspace
      const member = await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: user.id,
          role: role as any, // Type assertion to handle enum mapping
        },
        include: { user: true },
      })
      return { exists: false, member, invited: true }
    }

    // Create invitation for non-existent user
    // This would typically store invitation in a separate table
    // For now, return indication that user needs to be invited
    return {
      exists: false,
      member: null,
      pendingInvitation: {
        email,
        role,
        workspaceId,
      },
    }
  } catch {
    return null
  }
}

/**
 * Update workspace member role
 */
export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  newRole: 'ADMIN' | 'MEMBER' | 'VIEWER',
  updatedByUserId: string
) {
  try {
    // Check updater has permission
    const updater = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: updatedByUserId },
    })

    if (!updater || !['OWNER', 'ADMIN'].includes(updater.role)) {
      return null
    }

    // Prevent demoting owner
    const targetMember = await prisma.workspaceMember.findUnique({
      where: { id: memberId },
    })

    if (targetMember?.role === 'OWNER' && updater.role !== 'OWNER') {
      return null
    }

    const updated = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role: newRole as any },
      include: { user: true },
    })

    return updated
  } catch {
    return null
  }
}

/**
 * Remove member from workspace
 */
export async function removeMember(
  workspaceId: string,
  memberId: string,
  removedByUserId: string
) {
  try {
    // Check remover has permission
    const remover = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: removedByUserId },
    })

    if (!remover || !['OWNER', 'ADMIN'].includes(remover.role)) {
      return null
    }

    // Prevent removing owner
    const member = await prisma.workspaceMember.findUnique({
      where: { id: memberId },
    })

    if (member?.role === 'OWNER') {
      return null
    }

    await prisma.workspaceMember.delete({
      where: { id: memberId },
    })

    return true
  } catch {
    return null
  }
}

/**
 * Check if user is workspace owner
 */
export async function isWorkspaceOwner(workspaceId: string, userId: string): Promise<boolean> {
  try {
    const member = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId, role: 'OWNER' },
    })
    return !!member
  } catch {
    return false
  }
}

/**
 * Check if user is workspace admin or owner
 */
export async function isWorkspaceAdmin(workspaceId: string, userId: string): Promise<boolean> {
  try {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    })
    return !!member
  } catch {
    return false
  }
}
