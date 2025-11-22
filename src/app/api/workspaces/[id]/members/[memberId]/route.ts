import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  updateMemberRole,
  removeMember,
  isWorkspaceAdmin,
} from '@/lib/middleware/workspace'

interface RouteParams {
  params: {
    id: string
    memberId: string
  }
}

/**
 * PUT /api/workspaces/[id]/members/[memberId] - Update member role
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const { id: workspaceId, memberId } = params
    const { role } = await request.json()

    if (!role || !['ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Verify updater is admin
    const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can update roles' },
        { status: 403 }
      )
    }

    // Update role
    const updated = await updateMemberRole(
      workspaceId,
      memberId,
      role as 'ADMIN' | 'MEMBER' | 'VIEWER',
      user.id
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update role' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      member: {
        id: updated.id,
        userId: updated.userId,
        role: updated.role,
      },
    })
  } catch (error) {
    console.error('Error updating member role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/workspaces/[id]/members/[memberId] - Remove member
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const { id: workspaceId, memberId } = params

    // Verify remover is admin
    const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can remove members' },
        { status: 403 }
      )
    }

    // Remove member
    const result = await removeMember(workspaceId, memberId, user.id)

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to remove member' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
