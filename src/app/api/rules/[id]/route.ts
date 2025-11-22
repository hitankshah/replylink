import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * Rule CRUD API
 * GET: Return rule details
 * PUT: Update rule
 * DELETE: Delete rule
 */

async function getSession(request: NextRequest) {
  const sessionToken = cookies().get('sessionToken')?.value
  if (!sessionToken) return null

  return await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rule = await prisma.rule.findUnique({
      where: { id: params.id },
      include: {
        account: {
          select: {
            username: true,
            platform: true,
          },
        },
      },
    })

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    // Verify ownership
    if (rule.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(
      {
        id: rule.id,
        name: rule.name,
        description: rule.description,
        platform: rule.account.platform,
        accountName: rule.account.username,
        triggerType: rule.triggerType,
        triggerConfig: rule.triggerConfig,
        actionType: rule.actionType,
        actionConfig: rule.actionConfig,
        priority: rule.priority,
        isActive: rule.isActive,
        createdAt: rule.createdAt,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching rule:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rule' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rule = await prisma.rule.findUnique({
      where: { id: params.id },
    })

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    // Verify ownership
    if (rule.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    const updated = await prisma.rule.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.triggerType && { triggerType: body.triggerType }),
        ...(body.triggerConfig !== undefined && { triggerConfig: body.triggerConfig }),
        ...(body.actionType && { actionType: body.actionType }),
        ...(body.actionConfig && { actionConfig: body.actionConfig }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    })

    return NextResponse.json(
      {
        id: updated.id,
        name: updated.name,
        isActive: updated.isActive,
        priority: updated.priority,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating rule:', error)
    return NextResponse.json(
      { error: 'Failed to update rule' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rule = await prisma.rule.findUnique({
      where: { id: params.id },
    })

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    // Verify ownership
    if (rule.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.rule.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting rule:', error)
    return NextResponse.json(
      { error: 'Failed to delete rule' },
      { status: 500 }
    )
  }
}
