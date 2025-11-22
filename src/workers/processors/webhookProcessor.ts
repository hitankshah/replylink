import { WebhookJobData } from '@/lib/queues'
import { addReplyJob } from '@/lib/queues'
import { prisma } from '@/lib/prisma'

export async function processWebhook(data: WebhookJobData) {
    try {
        const { platform, event, payload } = data

        switch (platform) {
            case 'INSTAGRAM':
                await handleInstagramWebhook(event, payload)
                break
            case 'FACEBOOK':
                await handleFacebookWebhook(event, payload)
                break
            case 'WHATSAPP':
                await handleWhatsAppWebhook(event, payload)
                break
            default:
                console.warn(`Unknown platform: ${platform}`)
        }

        return { success: true }
    } catch (error) {
        console.error('Webhook processing error:', error)
        throw error
    }
}

async function handleInstagramWebhook(event: string, payload: any) {
    // Parse Instagram webhook event
    console.log('Processing Instagram webhook:', event)

    // Match against rules
    const rules = await findMatchingRules('INSTAGRAM', event, payload)

    // Queue reply jobs for matched rules
    for (const rule of rules) {
        await addReplyJob({
            ruleId: rule.id,
            accountId: rule.accountId,
            triggerData: {
                platform: 'INSTAGRAM',
                messageId: payload.messageId || payload.commentId,
                senderId: payload.senderId,
                content: payload.message || payload.text,
                type: event.includes('comment') ? 'comment' : 'dm',
            },
            actionConfig: rule.actionConfig as any,
        })
    }
}

async function handleFacebookWebhook(event: string, payload: any) {
    console.log('Processing Facebook webhook:', event)

    const rules = await findMatchingRules('FACEBOOK', event, payload)

    for (const rule of rules) {
        await addReplyJob({
            ruleId: rule.id,
            accountId: rule.accountId,
            triggerData: {
                platform: 'FACEBOOK',
                messageId: payload.messageId || payload.commentId,
                senderId: payload.senderId,
                content: payload.message || payload.text,
                type: event.includes('comment') ? 'comment' : 'dm',
            },
            actionConfig: rule.actionConfig as any,
        })
    }
}

async function handleWhatsAppWebhook(event: string, payload: any) {
    console.log('Processing WhatsApp webhook:', event)

    const rules = await findMatchingRules('WHATSAPP', event, payload)

    for (const rule of rules) {
        await addReplyJob({
            ruleId: rule.id,
            accountId: rule.accountId,
            triggerData: {
                platform: 'WHATSAPP',
                messageId: payload.messageId,
                senderId: payload.from,
                content: payload.text?.body || '',
                type: 'message',
            },
            actionConfig: rule.actionConfig as any,
        })
    }
}

async function findMatchingRules(platform: string, event: string, payload: any) {
    // Get all active rules for this platform
    const rules = await prisma.rule.findMany({
        where: {
            account: {
                platform: platform as any,
            },
            isActive: true,
        },
        include: {
            account: true,
        },
    })

    // Filter rules based on trigger conditions
    return rules.filter((rule) => {
        const config = rule.triggerConfig as any

        // Check keyword matches
        if (rule.triggerType === 'COMMENT_KEYWORD' || rule.triggerType === 'DM_KEYWORD') {
            const keywords = config.keywords || []
            const content = (payload.message || payload.text || '').toLowerCase()
            return keywords.some((keyword: string) => content.includes(keyword.toLowerCase()))
        }

        // Check first-time DM
        if (rule.triggerType === 'FIRST_TIME_DM') {
            return event.includes('message') && payload.isFirstMessage
        }

        // Check out-of-hours
        if (rule.triggerType === 'OUT_OF_HOURS') {
            const now = new Date()
            const hour = now.getHours()
            return hour < (config.startHour || 9) || hour >= (config.endHour || 17)
        }

        return false
    })
}
