import { Worker, Job } from 'bullmq'
import {
    replyQueue,
    analyticsQueue,
    webhookQueue,
    notificationQueue,
    ReplyJobData,
    AnalyticsJobData,
    WebhookJobData,
    NotificationJobData
} from '@/lib/queues'
import { processReply } from './processors/replyProcessor'
import { processAnalytics } from './processors/analyticsProcessor'
import { processWebhook } from './processors/webhookProcessor'
import { processNotification } from './processors/notificationProcessor'

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
}

// ========================================
// REPLY WORKER
// ========================================
const replyWorker = new Worker<ReplyJobData>(
    'reply-queue',
    async (job: Job<ReplyJobData>) => {
        console.log(`Processing reply job ${job.id}`)
        return await processReply(job.data)
    },
    {
        connection,
        concurrency: 5,
    }
)

replyWorker.on('completed', (job) => {
    console.log(`✅ Reply job ${job.id} completed`)
})

replyWorker.on('failed', (job, err) => {
    console.error(`❌ Reply job ${job?.id} failed:`, err)
})

// ========================================
// ANALYTICS WORKER
// ========================================
const analyticsWorker = new Worker<AnalyticsJobData>(
    'analytics-queue',
    async (job: Job<AnalyticsJobData>) => {
        console.log(`Processing analytics job ${job.id}`)
        return await processAnalytics(job.data)
    },
    {
        connection,
        concurrency: 10,
    }
)

analyticsWorker.on('completed', (job) => {
    console.log(`✅ Analytics job ${job.id} completed`)
})

analyticsWorker.on('failed', (job, err) => {
    console.error(`❌ Analytics job ${job?.id} failed:`, err)
})

// ========================================
// WEBHOOK WORKER
// ========================================
const webhookWorker = new Worker<WebhookJobData>(
    'webhook-queue',
    async (job: Job<WebhookJobData>) => {
        console.log(`Processing webhook job ${job.id}`)
        return await processWebhook(job.data)
    },
    {
        connection,
        concurrency: 5,
    }
)

webhookWorker.on('completed', (job) => {
    console.log(`✅ Webhook job ${job.id} completed`)
})

webhookWorker.on('failed', (job, err) => {
    console.error(`❌ Webhook job ${job?.id} failed:`, err)
})

// ========================================
// NOTIFICATION WORKER
// ========================================
const notificationWorker = new Worker<NotificationJobData>(
    'notification-queue',
    async (job: Job<NotificationJobData>) => {
        console.log(`Processing notification job ${job.id}`)
        return await processNotification(job.data)
    },
    {
        connection,
        concurrency: 3,
    }
)

notificationWorker.on('completed', (job) => {
    console.log(`✅ Notification job ${job.id} completed`)
})

notificationWorker.on('failed', (job, err) => {
    console.error(`❌ Notification job ${job?.id} failed:`, err)
})

// ========================================
// GRACEFUL SHUTDOWN
// ========================================
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing workers...')
    await Promise.all([
        replyWorker.close(),
        analyticsWorker.close(),
        webhookWorker.close(),
        notificationWorker.close(),
    ])
    process.exit(0)
})

console.log('🚀 Workers started successfully')
console.log('  - Reply Worker (concurrency: 5)')
console.log('  - Analytics Worker (concurrency: 10)')
console.log('  - Webhook Worker (concurrency: 5)')
console.log('  - Notification Worker (concurrency: 3)')
