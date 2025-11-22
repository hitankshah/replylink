import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isWorkspaceAdmin } from '@/lib/middleware/workspace'

/**
 * GET /api/admin/users - List all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify admin access
    const user = session.user as any
    const isGlobalAdmin = user.role === 'ADMIN'

    if (!isGlobalAdmin) {
      // Check workspace admin
      const workspaceId = user.workspaceId
      if (!workspaceId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      const isAdmin = await isWorkspaceAdmin(workspaceId, user.id)
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Get pagination params
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Fetch users
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscription: {
          select: {
            planType: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get usage stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const usage = await prisma.monthlyUsage.findFirst({
          where: {
            userId: user.id,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          },
        })

        const subscription = user.subscription

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: subscription?.planType || 'FREE',
          status: subscription?.status || 'active',
          createdAt: user.createdAt,
          monthlyUsage: usage?.repliesSent || 0,
          dailyLimit: subscription?.planType === 'FREE' ? 10 : subscription?.planType === 'PRO' ? 100 : 1000,
        }
      })
    )

    return NextResponse.json({ users: usersWithStats, page, limit })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
