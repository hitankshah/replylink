'use client'

import { useEffect, useState } from 'react'
import { Instagram, Facebook, MessageCircle, MousePointerClick, Eye, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getPusherClient, PUSHER_EVENTS, getUserChannel } from '@/lib/pusher'

interface Activity {
    id: string
    type: 'page_view' | 'button_click' | 'reply_sent' | 'rule_triggered'
    message: string
    platform?: 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP'
    timestamp: Date
}

export default function LiveActivityFeed() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRecentActivities()
        setupRealtimeUpdates()
    }, [])

    async function fetchRecentActivities() {
        setLoading(true)
        try {
            const response = await fetch('/api/activity/recent')
            const result = await response.json()
            setActivities(result.data || generateDemoData())
        } catch (error) {
            console.error('Failed to fetch activities:', error)
            setActivities(generateDemoData())
        } finally {
            setLoading(false)
        }
    }

    function setupRealtimeUpdates() {
        const userId = 'demo-user-123' // Get from auth context
        const pusher = getPusherClient()
        const channel = pusher.subscribe(getUserChannel(userId))

        channel.bind(PUSHER_EVENTS.PAGE_VIEW, (data: any) => {
            addActivity({
                id: Date.now().toString(),
                type: 'page_view',
                message: `New visitor viewed your link page`,
                timestamp: new Date(),
            })
        })

        channel.bind(PUSHER_EVENTS.BUTTON_CLICK, (data: any) => {
            addActivity({
                id: Date.now().toString(),
                type: 'button_click',
                message: `Visitor clicked "${data.buttonLabel}" button`,
                timestamp: new Date(),
            })
        })

        channel.bind(PUSHER_EVENTS.REPLY_SENT, (data: any) => {
            addActivity({
                id: Date.now().toString(),
                type: 'reply_sent',
                message: `Auto-replied on ${data.platform}`,
                platform: data.platform,
                timestamp: new Date(),
            })
        })

        channel.bind(PUSHER_EVENTS.RULE_TRIGGERED, (data: any) => {
            addActivity({
                id: Date.now().toString(),
                type: 'rule_triggered',
                message: `Rule "${data.ruleName}" triggered`,
                platform: data.platform,
                timestamp: new Date(),
            })
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }

    function addActivity(activity: Activity) {
        setActivities((prev) => [activity, ...prev].slice(0, 20))
    }

    function generateDemoData(): Activity[] {
        return [
            {
                id: '1',
                type: 'reply_sent',
                message: 'Auto-replied to Instagram comment',
                platform: 'INSTAGRAM',
                timestamp: new Date(Date.now() - 2 * 60 * 1000),
            },
            {
                id: '2',
                type: 'button_click',
                message: 'Visitor clicked "WhatsApp" button',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
            },
            {
                id: '3',
                type: 'page_view',
                message: 'New visitor viewed your link page',
                timestamp: new Date(Date.now() - 8 * 60 * 1000),
            },
            {
                id: '4',
                type: 'rule_triggered',
                message: 'Rule "DM Keywords" triggered',
                platform: 'FACEBOOK',
                timestamp: new Date(Date.now() - 12 * 60 * 1000),
            },
            {
                id: '5',
                type: 'reply_sent',
                message: 'Auto-replied to WhatsApp message',
                platform: 'WHATSAPP',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
            },
        ]
    }

    function getActivityIcon(type: string) {
        switch (type) {
            case 'page_view':
                return <Eye className="w-5 h-5 text-blue-500" />
            case 'button_click':
                return <MousePointerClick className="w-5 h-5 text-green-500" />
            case 'reply_sent':
                return <MessageSquare className="w-5 h-5 text-purple-500" />
            case 'rule_triggered':
                return <MessageCircle className="w-5 h-5 text-orange-500" />
            default:
                return null
        }
    }

    function getPlatformIcon(platform?: string) {
        switch (platform) {
            case 'INSTAGRAM':
                return <Instagram className="w-4 h-4 text-pink-500" />
            case 'FACEBOOK':
                return <Facebook className="w-4 h-4 text-blue-600" />
            case 'WHATSAPP':
                return <MessageCircle className="w-4 h-4 text-green-500" />
            default:
                return null
        }
    }

    function getTimeAgo(date: Date): string {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

        if (seconds < 60) return 'Just now'
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return formatDate(date)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-400">Loading activity feed...</div>
            </div>
        )
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No recent activity. Your feed will update in real-time!
                </div>
            ) : (
                activities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition animate-slide-in"
                    >
                        <div className="p-2 rounded-lg bg-white shadow-sm">
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                {activity.platform && (
                                    <span className="inline-flex items-center">
                                        {getPlatformIcon(activity.platform)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                ))
            )}
        </div>
    )
}
