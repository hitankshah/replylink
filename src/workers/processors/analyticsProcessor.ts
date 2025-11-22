import { AnalyticsJobData } from '@/lib/queues'
import { prisma } from '@/lib/prisma'
import { triggerRealtimeEvent, getUserChannel, PUSHER_EVENTS } from '@/lib/pusher'

export async function processAnalytics(data: AnalyticsJobData) {
    try {
        const { type, data: eventData } = data

        switch (type) {
            case 'page_view':
                await trackPageView(eventData)
                break
            case 'button_click':
                await trackButtonClick(eventData)
                break
            case 'reply_sent':
                // Already tracked in reply processor
                break
            default:
                console.warn(`Unknown analytics type: ${type}`)
        }

        return { success: true }
    } catch (error) {
        console.error('Analytics processing error:', error)
        throw error
    }
}

async function trackPageView(data: any) {
    const { pageId, userId, metadata } = data

    // Create page view record
    await prisma.pageView.create({
        data: {
            pageId,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
            referrer: metadata?.referrer,
            country: metadata?.country,
            city: metadata?.city,
            device: metadata?.device,
        },
    })

    // Update monthly usage
    const now = new Date()
    await prisma.monthlyUsage.upsert({
        where: {
            userId_year_month: {
                userId,
                year: now.getFullYear(),
                month: now.getMonth() + 1,
            },
        },
        update: {
            pageViews: { increment: 1 },
        },
        create: {
            userId,
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            pageViews: 1,
        },
    })

    // Trigger real-time event
    await triggerRealtimeEvent(
        getUserChannel(userId),
        PUSHER_EVENTS.PAGE_VIEW,
        { pageId }
    )
}

async function trackButtonClick(data: any) {
    const { buttonId, userId, metadata } = data

    // Create button click record
    await prisma.buttonClick.create({
        data: {
            buttonId,
            ipAddress: metadata?.ipAddress,
            userAgent: metadata?.userAgent,
            referrer: metadata?.referrer,
            country: metadata?.country,
            city: metadata?.city,
            device: metadata?.device,
        },
    })

    // Update monthly usage
    const now = new Date()
    await prisma.monthlyUsage.upsert({
        where: {
            userId_year_month: {
                userId,
                year: now.getFullYear(),
                month: now.getMonth() + 1,
            },
        },
        update: {
            buttonClicks: { increment: 1 },
        },
        create: {
            userId,
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            buttonClicks: 1,
        },
    })

    // Get button details for event
    const button = await prisma.linkButton.findUnique({
        where: { id: buttonId },
    })

    // Trigger real-time event
    await triggerRealtimeEvent(
        getUserChannel(userId),
        PUSHER_EVENTS.BUTTON_CLICK,
        {
            buttonId,
            buttonLabel: button?.label,
        }
    )
}
