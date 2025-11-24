import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

/**
 * GET /api/qr-code?pageId=xxx
 * Generate QR code for a link page
 */
export async function GET(request: NextRequest) {
  try {
    const pageId = request.nextUrl.searchParams.get('pageId')

    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }

    // Fetch the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        username: true,
      },
    })

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }

    // Construct public page URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const publicPageUrl = `${baseUrl}/${page.username}`

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(publicPageUrl, {
      type: 'png',
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return new NextResponse(qrBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
        'Content-Disposition': `attachment; filename="${page.username}-qrcode.png"`,
      },
    })
  } catch (error) {
    console.error('QR code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
