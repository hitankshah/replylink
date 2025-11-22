import { ReplyJobData } from '@/lib/queues'
import { NormalizedEvent } from '@/integrations/social/adapter'
import redis from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { triggerRealtimeEvent, getUserChannel, PUSHER_EVENTS } from '@/lib/pusher'
import { checkReplyLimit } from '@/lib/middleware/planEnforcement'
import { getAdapter } from '@/integrations/social/factory'
import { RuleEngine } from '@/services/ruleEngine'
import crypto from 'crypto'

interface ExponentialBackoff {
  delayMs: number
  maxRetries: number
  currentAttempt: number
}

export async function processReply(data: ReplyJobData) {
    const backoff: ExponentialBackoff = {
        delayMs: 1000,
        maxRetries: 3,
        currentAttempt: 0,
    }

    while (backoff.currentAttempt <= backoff.maxRetries) {
        try {
            const { ruleId, socialAccountId, event, renderedMessage, actionConfig } = data

            // 1. Get rule and account details
            const [rule, account] = await Promise.all([
                prisma.rule.findUnique({ where: { id: ruleId } }),
                prisma.socialAccount.findUnique({ where: { id: socialAccountId } }),
            ])

            if (!rule || !account) {
                throw new Error('Rule or account not found')
            }

            // 2. Check monthly reply limit
            const replyLimit = await checkReplyLimit(account.userId)
            if (replyLimit.exceeded) {
                console.warn(
                    `[Reply Processor] Monthly reply limit exceeded for user ${account.userId}. ` +
                    `Current: ${replyLimit.current}/${replyLimit.limit}`
                )
                throw new Error(
                    `Monthly reply limit exceeded (${replyLimit.current}/${replyLimit.limit}). ` +
                    `Upgrade your plan to send more replies.`
                )
            }

            // 3. Get platform adapter
            const adapter = getAdapter(event.platform)
            if (!adapter) {
                throw new Error(`Unsupported platform: ${event.platform}`)
            }

            // 4. Decrypt account token
            const decryptedToken = decryptToken(account.accessToken, account.tokenIv)

            // 5. Send reply based on action type
            let response: any
            const actionType = (actionConfig as any).action || 'REPLY'

            switch (actionType) {
                case 'REPLY':
                    response = await adapter.sendReply(
                        decryptedToken,
                        event.messageId || event.metadata?.messageId,
                        renderedMessage
                    )
                    break

                case 'DIRECT_MESSAGE':
                    response = await adapter.sendDirectMessage(
                        decryptedToken,
                        event.senderId,
                        renderedMessage
                    )
                    break

                case 'LINK_SHARE':
                    const linkUrl = (actionConfig as any).linkUrl || 'https://link.page'
                    response = await adapter.sendReply(
                        decryptedToken,
                        event.messageId || event.metadata?.messageId,
                        `${renderedMessage}\n\n${linkUrl}`
                    )
                    break

                default:
                    throw new Error(`Unknown action type: ${actionType}`)
            }

            // 6. Execute rule action via engine
            await RuleEngine.executeRuleAction(rule, event, renderedMessage)

            // 7. Update monthly usage
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

            // 8. Trigger real-time event
            await triggerRealtimeEvent(
                getUserChannel(account.userId),
                PUSHER_EVENTS.REPLY_SENT,
                {
                    platform: event.platform,
                    ruleName: rule.name,
                    success: true,
                }
            )

            return { success: true, response }
        } catch (error) {
            backoff.currentAttempt++

            // Determine if error is retryable
            const isRetryable = isRetryableError(error)
            if (!isRetryable || backoff.currentAttempt > backoff.maxRetries) {
                console.error(`[Reply Processor] Final error after ${backoff.currentAttempt} attempts:`, error)

                // Log failed execution
                await prisma.ruleExecutionLog.create({
                    data: {
                        ruleId: data.ruleId,
                        eventType: (data.event as NormalizedEvent).type,
                        senderId: (data.event as NormalizedEvent).senderId,
                        result: 'FAILED',
                    },
                })

                throw error
            }

            // Exponential backoff: 1s, 2s, 4s
            const delayMs = backoff.delayMs * Math.pow(2, backoff.currentAttempt - 1)
            console.log(
                `[Reply Processor] Retrying after ${delayMs}ms (attempt ${backoff.currentAttempt}/${backoff.maxRetries})`
            )

            await new Promise((resolve) => setTimeout(resolve, delayMs))
        }
    }
}

/**
 * Determine if error is retryable
 */
function isRetryableError(error: any): boolean {
    const message = error?.message || ''
    const code = error?.code || ''

    // Rate limit errors are retryable
    if (code === 'RATE_LIMIT' || message.includes('rate limit')) {
        return true
    }

    // Timeout errors are retryable
    if (code === 'TIMEOUT' || message.includes('timeout')) {
        return true
    }

    // Network errors are retryable
    if (code === 'ECONNREFUSED' || code === 'ENOTFOUND') {
        return true
    }

    return false
}

/**
 * Decrypt token using stored IV
 */
function decryptToken(encryptedToken: string, tokenIv: string): string {
    const encryptionKey = process.env.ENCRYPTION_KEY!
    const iv = Buffer.from(tokenIv, 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv)
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

