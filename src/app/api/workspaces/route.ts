import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  getUserWorkspaces,
  setActiveWorkspace,
} from '@/lib/middleware/workspace'

/**
 * GET /api/workspaces - Get user's workspaces
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const workspaces = await getUserWorkspaces(user.id)

    const formattedWorkspaces = workspaces.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      role: membership.role,
      memberCount: membership.workspace._count.members,
    }))

    return NextResponse.json({ workspaces: formattedWorkspaces })
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/workspaces - Create new workspace
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Workspace name required' }, { status: 400 })
    }

    // Create workspace
    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        ownerId: user.id,
      },
    })

    // Add creator as owner
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: 'OWNER',
      },
    })

    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
      },
    })
  } catch (error) {
    console.error('Error creating workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
