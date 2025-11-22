import { WebhookJobData } from '@/lib/queues'
import { prisma } from '@/lib/prisma'

export async function processWebhook(data: WebhookJobData) {
    try {
        // Data now contains NormalizedEvent directly
        const event = data.event as any

        // TODO: Implement rule matching and reply queueing
        // This is a placeholder that just logs incoming webhooks
        console.log('[WebhookProcessor] Received event:', {
            platform: event.platform,
            type: event.type,
            senderId: event.senderId,
            content: event.content,
        })

        return { success: true }
    } catch (error) {
        console.error('Webhook processing error:', error)
        throw error
    }
}

