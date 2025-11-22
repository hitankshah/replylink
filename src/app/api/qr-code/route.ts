import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCachedQRCode, generateQRCodeBuffer } from '@/lib/qrCode'
import { verifyToken } from '@/lib/auth'
import { cache } from '@/lib/cache'

/**
 * GET /api/qr-code/[pageId]
 * Generate or retrieve cached QR code for a page
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const pageId = params.pageId
    const format = request.nextUrl.searchParams.get('format') || 'png'

    // Verify page exists and is published
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        slug: true,
        workspace: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Construct public page URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://replylink.io'
    const publicPageUrl = `${baseUrl}/link/${page.slug}`

    // Generate QR code based on format
    if (format === 'buffer' || format === 'png') {
      const buffer = await generateQRCodeBuffer(publicPageUrl, {
        size: 300,
        errorCorrectionLevel: 'H',
      })

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    if (format === 'dataurl' || format === 'svg') {
      const dataUrl = await generateCachedQRCode(pageId, publicPageUrl, {
        size: 300,
        errorCorrectionLevel: 'H',
      })

      return NextResponse.json({
        qrCode: dataUrl,
        format: 'data-url',
        url: publicPageUrl,
      })
    }

    return NextResponse.json(
      { error: 'Invalid format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/qr-code
 * Generate QR code for authenticated user's page
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { pageId, format = 'dataurl', brandColor } = body

    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        slug: true,
        workspace: {
          select: {
            members: {
              where: { userId: user.id },
              select: { id: true },
            },
          },
        },
      },
    })

    if (!page || page.workspace.members.length === 0) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    // Construct public page URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://replylink.io'
    const publicPageUrl = `${baseUrl}/link/${page.slug}`

    // Generate QR code with options
    let qrCode: string | Buffer

    if (format === 'png') {
      qrCode = await generateQRCodeBuffer(publicPageUrl, {
        size: 300,
        errorCorrectionLevel: 'H',
        color: brandColor ? { dark: brandColor, light: '#FFFFFF' } : undefined,
      })

      return new NextResponse(qrCode, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }

    qrCode = await generateCachedQRCode(pageId, publicPageUrl, {
      size: 300,
      errorCorrectionLevel: 'H',
      color: brandColor ? { dark: brandColor, light: '#FFFFFF' } : undefined,
    })

    return NextResponse.json({
      qrCode,
      format: 'data-url',
      url: publicPageUrl,
      pageId,
    })
  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
