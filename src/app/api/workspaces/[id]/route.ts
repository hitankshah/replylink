import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyWorkspaceAccess, setActiveWorkspace } from '@/lib/middleware/workspace'

interface RouteParams {
  params: {
    id: string
  }
}

/**
 * GET /api/workspaces/[id] - Get workspace details
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
    const workspace = await verifyWorkspaceAccess(workspaceId, user.id)
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 })
    }

    return NextResponse.json({ workspace })
  } catch (error) {
    console.error('Error fetching workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/workspaces/[id] - Update workspace
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const workspaceId = params.id

    // Verify owner/admin access
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { name } = await request.json()

    if (name && name.trim().length === 0) {
      return NextResponse.json({ error: 'Workspace name cannot be empty' }, { status: 400 })
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(name && { name: name.trim() }),
      },
    })

    return NextResponse.json({ workspace: updatedWorkspace })
  } catch (error) {
    console.error('Error updating workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/workspaces/[id] - Delete workspace
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const workspaceId = params.id

    // Verify owner access (only owner can delete)
    const membership = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
        role: 'OWNER',
      },
    })

    if (!membership) {
      return NextResponse.json(
        { error: 'Only workspace owner can delete' },
        { status: 403 }
      )
    }

    // Delete workspace and all related data
    await prisma.$transaction([
      prisma.ruleExecutionLog.deleteMany({ where: { rule: { accountId: workspaceId } } }),
      prisma.rule.deleteMany({ where: { accountId: workspaceId } }),
      prisma.socialAccount.deleteMany({ where: { workspaceId } }),
      prisma.workspaceMember.deleteMany({ where: { workspaceId } }),
      prisma.workspace.delete({ where: { id: workspaceId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
