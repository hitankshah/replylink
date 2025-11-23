import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createRuleSchema } from '@/lib/validators'
import { validateRequest } from '@/lib/validators/utils'

/**
 * Rules Management API
 * GET: List rules with pagination and filters
 * POST: Create new rule
 */

async function getSession(request: NextRequest) {
  const sessionToken = cookies().get('sessionToken')?.value
  if (!sessionToken) return null

  return await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const platform = searchParams.get('platform')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Build filters
    const where: any = {
      userId: session.userId,
    }

    if (platform) {
      where.account = { platform: platform.toUpperCase() }
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    // Get total count
    const total = await prisma.rule.count({ where })

    // Get paginated results
    const rules = await prisma.rule.findMany({
      where,
      include: {
        account: {
          select: {
            platform: true,
            username: true,
          },
        },
        _count: {
          select: { executionLogs: true },
        },
      },
      orderBy: { priority: 'desc' },
      skip,
      take: limit,
    })

    const mapped = rules.map((rule: any) => ({
      id: rule.id,
      name: rule.name,
      platform: rule.account.platform,
      accountName: rule.account.username,
      triggerType: rule.triggerType,
      actionType: rule.actionType,
      priority: rule.priority,
      isActive: rule.isActive,
      executionCount: rule._count.executionLogs,
      createdAt: rule.createdAt,
    }))

    return NextResponse.json(
      {
        data: mapped,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body using Zod
    const validation = await validateRequest(request, createRuleSchema)
    if (!validation.success) {
      return validation.error
    }

    const body = validation.data

    // Verify user owns the account
    const account = await prisma.socialAccount.findFirst({
      where: {
        id: body.socialAccountId,
        userId: session.userId,
      },
    })

    if (!account) {
      return NextResponse.json(
        { error: 'Social account not found or not owned by user' },
        { status: 404 }
      )
    }

    // Create rule
    const rule = await prisma.rule.create({
      data: {
        userId: session.userId,
        accountId: body.socialAccountId,
        name: body.name,
        triggerType: body.triggerType,
        triggerConfig: {
          keywords: body.triggerKeywords ? body.triggerKeywords.split(',').map((k: string) => k.trim()) : [],
          time: body.triggerTime
        },
        actionType: body.actionType,
        actionConfig: { message: body.actionMessage },
        priority: body.priority,
        isActive: body.enabled,
      },
      include: {
        account: {
          select: {
            platform: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        id: rule.id,
        name: rule.name,
        platform: rule.account.platform,
        accountName: rule.account.username,
        triggerType: rule.triggerType,
        actionType: rule.actionType,
        priority: rule.priority,
        isActive: rule.isActive,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating rule:', error)
    return NextResponse.json(
      { error: 'Failed to create rule' },
      { status: 500 }
    )
  }
}
