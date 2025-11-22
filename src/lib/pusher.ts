import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.PUSHER_CLUSTER || 'us2',
    useTLS: true,
})

// Client-side Pusher instance (for use in components)
export function getPusherClient() {
    return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
        cluster: process.env.PUSHER_CLUSTER || 'us2',
    })
}

// Event types for type safety
export const PUSHER_EVENTS = {
    PAGE_VIEW: 'page-view',
    BUTTON_CLICK: 'button-click',
    REPLY_SENT: 'reply-sent',
    RULE_TRIGGERED: 'rule-triggered',
    ACCOUNT_CONNECTED: 'account-connected',
    SUBSCRIPTION_UPDATED: 'subscription-updated',
} as const

// Helper to trigger events
export async function triggerRealtimeEvent(
    channel: string,
    event: string,
    data: any
) {
    try {
        await pusherServer.trigger(channel, event, data)
    } catch (error) {
        console.error('Pusher trigger error:', error)
    }
}

// Channel name generators
export function getUserChannel(userId: string): string {
    return `user-${userId}`
}

export function getPageChannel(pageId: string): string {
    return `page-${pageId}`
}

export function getWorkspaceChannel(workspaceId: string): string {
    return `workspace-${workspaceId}`
}
