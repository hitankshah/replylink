import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { setActiveWorkspace } from '@/lib/middleware/workspace'

/**
 * POST /api/workspaces/select - Set active workspace
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user as any
    const { workspaceId } = await request.json()

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    // Set active workspace
    const updatedUser = await setActiveWorkspace(user.id, workspaceId)

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        activeWorkspaceId: updatedUser.activeWorkspaceId,
      },
    })
  } catch (error) {
    console.error('Error selecting workspace:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
