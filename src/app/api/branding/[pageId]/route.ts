import { NextRequest, NextResponse } from 'next/server'
import {
  getPageTheme,
  updatePageTheme,
  applyBrandTemplate,
  updateCustomCSS,
  getBrandTemplates,
  generateThemeCSS,
  validateCustomCSS,
} from '@/lib/branding'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/branding/[pageId]
 * Get branding/theme configuration for a page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const pageId = params.pageId

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

    const theme = await getPageTheme(pageId)
    const css = generateThemeCSS(theme)
    const templates = getBrandTemplates()

    return NextResponse.json({
      theme,
      css,
      templates,
    })
  } catch (error) {
    console.error('Branding fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branding' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/branding/[pageId]
 * Update branding/theme configuration
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const pageId = params.pageId
    const body = await request.json()

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

    // Handle template application
    if (body.applyTemplate) {
      const theme = await applyBrandTemplate(pageId, body.applyTemplate)
      return NextResponse.json({ theme })
    }

    // Validate custom CSS if provided
    if (body.customCSS) {
      if (!validateCustomCSS(body.customCSS)) {
        return NextResponse.json(
          { error: 'Invalid or unsafe CSS provided' },
          { status: 400 }
        )
      }
    }

    // Update theme
    const updatedTheme = await updatePageTheme(pageId, body)

    const css = generateThemeCSS(updatedTheme)

    return NextResponse.json({
      theme: updatedTheme,
      css,
    })
  } catch (error) {
    console.error('Branding update error:', error)
    return NextResponse.json(
      { error: 'Failed to update branding' },
      { status: 500 }
    )
  }
}
