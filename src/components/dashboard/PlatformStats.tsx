'use client'

import { useEffect, useState } from 'react'
import { Instagram, Facebook, MessageCircle, TrendingUp, Users, Zap } from 'lucide-react'

interface PlatformStat {
    platform: string
    icon: any
    color: string
    accounts: number
    replies: number
    topRule: string
}

export default function PlatformStats() {
    const [stats, setStats] = useState<PlatformStat[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPlatformStats()
    }, [])

    async function fetchPlatformStats() {
        setLoading(true)
        try {
            const response = await fetch('/api/analytics/platform-stats')
            const result = await response.json()
            setStats(result.data || generateDemoData())
        } catch (error) {
            console.error('Failed to fetch platform stats:', error)
            setStats(generateDemoData())
        } finally {
            setLoading(false)
        }
    }

    function generateDemoData(): PlatformStat[] {
        return [
            {
                platform: 'Instagram',
                icon: Instagram,
                color: 'bg-pink-500',
                accounts: 3,
                replies: 456,
                topRule: 'DM Auto-Reply',
            },
            {
                platform: 'Facebook',
                icon: Facebook,
                color: 'bg-blue-600',
                accounts: 2,
                replies: 289,
                topRule: 'Comment Keywords',
            },
            {
                platform: 'WhatsApp',
                icon: MessageCircle,
                color: 'bg-green-500',
                accounts: 1,
                replies: 178,
                topRule: 'Out of Hours',
            },
        ]
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-400">Loading stats...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">{stat.platform}</h4>
                                <p className="text-sm text-gray-600">
                                    {stat.accounts} account{stat.accounts > 1 ? 's' : ''} connected
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">{stat.replies}</p>
                            <p className="text-xs text-gray-500">auto-replies</p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-600">Top Rule:</p>
                            <p className="font-semibold text-purple-600">{stat.topRule}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
