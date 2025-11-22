import { NextRequest, NextResponse } from 'next/server'
import {
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  getPageCollaborators,
  hasPageAccess,
  getActivityHistory,
  addComment,
  getPageComments,
  CollaboratorRole,
} from '@/lib/collaboration'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/collaborators
 * Add collaborator to page
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { pageId, email, role = 'VIEWER' } = body

    if (!pageId || !email) {
      return NextResponse.json(
        { error: 'pageId and email are required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    // Prevent adding owner as collaborator
    if (email === user.email) {
      return NextResponse.json(
        { error: 'Cannot add page owner as collaborator' },
        { status: 400 }
      )
    }

    const collaborator = await addCollaborator(pageId, email, role)

    return NextResponse.json(collaborator, { status: 201 })
  } catch (error) {
    console.error('Collaborator add error:', error)
    const message = error instanceof Error ? error.message : 'Failed to add collaborator'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

/**
 * GET /api/collaborators?pageId=xxx
 * Get page collaborators
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const pageId = request.nextUrl.searchParams.get('pageId')
    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    const collaborators = await getPageCollaborators(pageId)

    return NextResponse.json({ collaborators })
  } catch (error) {
    console.error('Error fetching collaborators:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collaborators' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/collaborators
 * Remove collaborator from page
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { pageId, collaboratorId } = body

    if (!pageId || !collaboratorId) {
      return NextResponse.json(
        { error: 'pageId and collaboratorId are required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    await removeCollaborator(pageId, collaboratorId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Collaborator removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove collaborator' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/collaborators
 * Update collaborator role
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { pageId, collaboratorId, role } = body

    if (!pageId || !collaboratorId || !role) {
      return NextResponse.json(
        { error: 'pageId, collaboratorId, and role are required' },
        { status: 400 }
      )
    }

    // Verify role is valid
    if (!Object.values(CollaboratorRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    const collaborator = await updateCollaboratorRole(pageId, collaboratorId, role)

    return NextResponse.json(collaborator)
  } catch (error) {
    console.error('Collaborator role update error:', error)
    return NextResponse.json(
      { error: 'Failed to update collaborator role' },
      { status: 500 }
    )
  }
}
