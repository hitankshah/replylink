import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { inviteToWorkspace, isWorkspaceAdmin } from '@/lib/middleware/workspace'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * POST /api/workspaces/[id]/members/invite - Invite user to workspace
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const workspaceId = params.id
    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role required' },
        { status: 400 }
      )
    }

    // Verify inviter is admin
    const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can invite members' },
        { status: 403 }
      )
    }

    // Invite user
    const result = await inviteToWorkspace(
      workspaceId,
      email,
      role as 'ADMIN' | 'MEMBER' | 'VIEWER',
      user.id
    )

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to invite member' },
        { status: 400 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error inviting member:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
