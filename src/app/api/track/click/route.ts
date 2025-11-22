import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { buttonId } = await req.json()

    if (!buttonId) {
      return NextResponse.json(
        { error: 'Button ID is required' },
        { status: 400 }
      )
    }

    // Get button with page and user info
    const button = await prisma.linkButton.findUnique({
      where: { id: buttonId },
      include: { page: true },
    })

    if (!button) {
      return NextResponse.json(
        { error: 'Button not found' },
        { status: 404 }
      )
    }

    // Get request information
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const referrer = req.headers.get('referer') || 'direct'

    // Record click
    const click = await prisma.buttonClick.create({
      data: {
        buttonId,
        ipAddress: clientIp,
        userAgent,
        referrer,
      },
    })

    // Update monthly usage
    const now = new Date()
    await prisma.monthlyUsage.upsert({
      where: {
        userId_year_month: {
          userId: button.page.userId,
          year: now.getFullYear(),
          month: now.getMonth() + 1,
        },
      },
      create: {
        userId: button.page.userId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        repliesSent: 0,
        buttonClicks: 1,
      },
      update: {
        buttonClicks: {
          increment: 1,
        },
      },
    })

    // TODO: Queue analytics job (BullMQ)
    // await analyticsQueue.add('button-click', {
    //   clickId: click.id,
    //   buttonId,
    //   pageId: button.pageId,
    //   userId: button.page.userId,
    // })

    console.log(`Button click tracked: ${buttonId}`)

    return NextResponse.json(
      {
        success: true,
        clickId: click.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'An error occurred while tracking the click' },
      { status: 500 }
    )
  }
}
