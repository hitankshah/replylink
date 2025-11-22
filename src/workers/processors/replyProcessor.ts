import { ReplyJobData } from '@/lib/queues'
import { prisma } from '@/lib/prisma'
import { triggerRealtimeEvent, getUserChannel, PUSHER_EVENTS } from '@/lib/pusher'

export async function processReply(data: ReplyJobData) {
    try {
        const { ruleId, accountId, triggerData, actionConfig } = data

        // 1. Get rule and account details
        const [rule, account] = await Promise.all([
            prisma.rule.findUnique({ where: { id: ruleId } }),
            prisma.socialAccount.findUnique({ where: { id: accountId } }),
        ])

        if (!rule || !account) {
            throw new Error('Rule or account not found')
        }

        // 2. Send reply based on platform
        let response
        switch (triggerData.platform) {
            case 'INSTAGRAM':
                response = await sendInstagramReply(account, triggerData, actionConfig)
                break
            case 'FACEBOOK':
                response = await sendFacebookReply(account, triggerData, actionConfig)
                break
            case 'WHATSAPP':
                response = await sendWhatsAppMessage(account, triggerData, actionConfig)
                break
            default:
                throw new Error(`Unsupported platform: ${triggerData.platform}`)
        }

        // 3. Log execution
        await prisma.ruleExecutionLog.create({
            data: {
                ruleId,
                accountId,
                triggerData: triggerData as any,
                actionTaken: actionConfig.type,
                success: true,
                responseData: response as any,
            },
        })

        // 4. Update monthly usage
        const now = new Date()
        await prisma.monthlyUsage.upsert({
            where: {
                userId_year_month: {
                    userId: account.userId,
                    year: now.getFullYear(),
                    month: now.getMonth() + 1,
                },
            },
            update: {
                repliesSent: { increment: 1 },
            },
            create: {
                userId: account.userId,
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                repliesSent: 1,
            },
        })

        // 5. Trigger real-time event
        await triggerRealtimeEvent(
            getUserChannel(account.userId),
            PUSHER_EVENTS.REPLY_SENT,
            {
                platform: triggerData.platform,
                ruleName: rule.name,
                success: true,
            }
        )

        return { success: true, response }
    } catch (error) {
        console.error('Reply processing error:', error)

        // Log failed execution
        await prisma.ruleExecutionLog.create({
            data: {
                ruleId: data.ruleId,
                accountId: data.accountId,
                triggerData: data.triggerData as any,
                actionTaken: data.actionConfig.type,
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
            },
        })

        throw error
    }
}

async function sendInstagramReply(
    account: any,
    triggerData: any,
    actionConfig: any
) {
    // TODO: Implement Instagram Graph API reply
    console.log('Sending Instagram reply:', {
        accountId: account.id,
        messageId: triggerData.messageId,
        message: actionConfig.message,
    })

    // Simulate API call
    return {
        platform: 'instagram',
        messageId: triggerData.messageId,
        sentAt: new Date(),
    }
}

async function sendFacebookReply(
    account: any,
    triggerData: any,
    actionConfig: any
) {
    // TODO: Implement Facebook Graph API reply
    console.log('Sending Facebook reply:', {
        accountId: account.id,
        messageId: triggerData.messageId,
        message: actionConfig.message,
    })

    return {
        platform: 'facebook',
        messageId: triggerData.messageId,
        sentAt: new Date(),
    }
}

async function sendWhatsAppMessage(
    account: any,
    triggerData: any,
    actionConfig: any
) {
    // TODO: Implement WhatsApp Cloud API message
    console.log('Sending WhatsApp message:', {
        accountId: account.id,
        messageId: triggerData.messageId,
        message: actionConfig.message,
    })

    return {
        platform: 'whatsapp',
        messageId: triggerData.messageId,
        sentAt: new Date(),
    }
}
