import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper to get user from session
async function getUserFromSession(req: NextRequest) {
  const sessionToken = req.cookies.get('sessionToken')?.value

  if (!sessionToken) {
    return null
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })

  return session?.user || null
}

// POST - Add button to page
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromSession(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { pageId, type, label, value, icon } = await req.json()

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Get next order
    const lastButton = await prisma.linkButton.findFirst({
      where: { pageId },
      orderBy: { order: 'desc' },
    })

    const button = await prisma.linkButton.create({
      data: {
        pageId,
        type,
        label,
        value,
        icon: icon || '',
        order: (lastButton?.order || 0) + 1,
      },
    })

    return NextResponse.json(
      {
        success: true,
        button,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Button creation error:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the button' },
      { status: 500 }
    )
  }
}

// PUT - Update button
export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromSession(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { buttonId, type, label, value, icon } = await req.json()

    // Get button and verify ownership
    const button = await prisma.linkButton.findUnique({
      where: { id: buttonId },
      include: { page: true },
    })

    if (!button || button.page.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updatedButton = await prisma.linkButton.update({
      where: { id: buttonId },
      data: {
        type: type || button.type,
        label: label || button.label,
        value: value || button.value,
        icon: icon ?? button.icon,
      },
    })

    return NextResponse.json(
      {
        success: true,
        button: updatedButton,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Button update error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating the button' },
      { status: 500 }
    )
  }
}

// DELETE - Remove button
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromSession(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { buttonId } = await req.json()

    // Get button and verify ownership
    const button = await prisma.linkButton.findUnique({
      where: { id: buttonId },
      include: { page: true },
    })

    if (!button || button.page.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.linkButton.delete({
      where: { id: buttonId },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Button deleted successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Button delete error:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the button' },
      { status: 500 }
    )
  }
}

// PATCH - Reorder buttons
export async function PATCH(req: NextRequest) {
  try {
    const user = await getUserFromSession(req)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { buttons } = await req.json() // Array of { id, order }

    // Verify all buttons belong to user's pages
    for (const btn of buttons) {
      const button = await prisma.linkButton.findUnique({
        where: { id: btn.id },
        include: { page: true },
      })

      if (!button || button.page.userId !== user.id) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
    }

    // Update all button orders
    await Promise.all(
      buttons.map((btn: any) =>
        prisma.linkButton.update({
          where: { id: btn.id },
          data: { order: btn.order },
        })
      )
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Buttons reordered successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Button reorder error:', error)
    return NextResponse.json(
      { error: 'An error occurred while reordering buttons' },
      { status: 500 }
    )
  }
}
