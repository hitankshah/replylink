import { Queue, Worker, Job } from 'bullmq'
import redis from '@/lib/redis'

// Queue names
export const QUEUE_NAMES = {
    REPLY: 'reply-queue',
    ANALYTICS: 'analytics-queue',
    WEBHOOK: 'webhook-queue',
    NOTIFICATION: 'notification-queue',
} as const

// Connection config for BullMQ
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
}

// ========================================
// REPLY QUEUE - For auto-replies
// ========================================

export interface ReplyJobData {
    ruleId: string
    accountId: string
    triggerData: {
        platform: 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP'
        messageId: string
        senderId: string
        content: string
        type: 'comment' | 'dm' | 'message'
    }
    actionConfig: {
        type: 'REPLY_COMMENT' | 'SEND_DM' | 'SEND_WHATSAPP'
        message: string
        template?: string
    }
}

export const replyQueue = new Queue<ReplyJobData>(QUEUE_NAMES.REPLY, {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            count: 100,
            age: 24 * 3600, // 24 hours
        },
        removeOnFail: {
            count: 500,
            age: 7 * 24 * 3600, // 7 days
        },
    },
})

// ========================================
// ANALYTICS QUEUE - For tracking events
// ========================================

export interface AnalyticsJobData {
    type: 'page_view' | 'button_click' | 'reply_sent'
    data: {
        pageId?: string
        buttonId?: string
        ruleId?: string
        userId: string
        metadata?: Record<string, any>
    }
}

export const analyticsQueue = new Queue<AnalyticsJobData>(QUEUE_NAMES.ANALYTICS, {
    connection,
    defaultJobOptions: {
        attempts: 2,
        backoff: {
            type: 'fixed',
            delay: 1000,
        },
    },
})

// ========================================
// WEBHOOK QUEUE - For incoming webhooks
// ========================================

export interface WebhookJobData {
    platform: 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP'
    event: string
    payload: any
    receivedAt: Date
}

export const webhookQueue = new Queue<WebhookJobData>(QUEUE_NAMES.WEBHOOK, {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
    },
})

// ========================================
// NOTIFICATION QUEUE - For user notifications
// ========================================

export interface NotificationJobData {
    userId: string
    type: 'email' | 'push' | 'in_app'
    subject: string
    message: string
    data?: Record<string, any>
}

export const notificationQueue = new Queue<NotificationJobData>(
    QUEUE_NAMES.NOTIFICATION,
    {
        connection,
        defaultJobOptions: {
            attempts: 2,
            backoff: {
                type: 'fixed',
                delay: 3000,
            },
        },
    }
)

// ========================================
// QUEUE HELPERS
// ========================================

export async function addReplyJob(data: ReplyJobData) {
    return replyQueue.add('process-reply', data, {
        priority: 1, // High priority
    })
}

export async function addAnalyticsJob(data: AnalyticsJobData) {
    return analyticsQueue.add('track-event', data, {
        priority: 3, // Lower priority
    })
}

export async function addWebhookJob(data: WebhookJobData) {
    return webhookQueue.add('process-webhook', data, {
        priority: 2,
    })
}

export async function addNotificationJob(data: NotificationJobData) {
    return notificationQueue.add('send-notification', data)
}

// Get queue stats
export async function getQueueStats(queueName: string) {
    let queue: Queue

    switch (queueName) {
        case QUEUE_NAMES.REPLY:
            queue = replyQueue
            break
        case QUEUE_NAMES.ANALYTICS:
            queue = analyticsQueue
            break
        case QUEUE_NAMES.WEBHOOK:
            queue = webhookQueue
            break
        case QUEUE_NAMES.NOTIFICATION:
            queue = notificationQueue
            break
        default:
            throw new Error(`Unknown queue: ${queueName}`)
    }

    const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
    ])

    return { waiting, active, completed, failed }
}
