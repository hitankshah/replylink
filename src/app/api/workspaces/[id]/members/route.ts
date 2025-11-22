import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getWorkspaceMembers } from '@/lib/middleware/workspace'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/workspaces/[id]/members - Get workspace members
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const workspaceId = params.id

    // Verify access
    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: user.id },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    const members = await getWorkspaceMembers(workspaceId)

    const formattedMembers = members.map((m) => ({
      id: m.id,
      email: m.user.email,
      name: m.user.name,
      role: m.role,
      joinedAt: m.createdAt,
    }))

    return NextResponse.json({ members: formattedMembers })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
