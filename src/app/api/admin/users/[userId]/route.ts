import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isWorkspaceAdmin } from '@/lib/middleware/workspace'

interface RouteParams {
  params: {
    userId: string
  }
}

/**
 * PUT /api/admin/users/[userId] - Update user plan or status
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin access
    const user = session.user as any
    const isGlobalAdmin = user.role === 'ADMIN'

    if (!isGlobalAdmin) {
      const workspaceId = user.workspaceId
      if (!workspaceId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const { planType } = await request.json()

    if (!['FREE', 'STARTER', 'PRO', 'AGENCY'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: params.userId },
      update: { planType },
      create: {
        userId: params.userId,
        planType,
        status: 'active',
      },
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/users/[userId]/suspend - Suspend user
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const pathParts = request.nextUrl.pathname.split('/')
    const action = pathParts[pathParts.length - 1]

    if (action !== 'suspend' && action !== 'reactivate') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin access
    const user = session.user as any
    const isGlobalAdmin = user.role === 'ADMIN'

    if (!isGlobalAdmin) {
      const workspaceId = user.workspaceId
      if (!workspaceId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const newStatus = action === 'suspend' ? 'suspended' : 'active'

    // Update subscription status
    const subscription = await prisma.subscription.update({
      where: { userId: params.userId },
      data: { status: newStatus },
    })

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
