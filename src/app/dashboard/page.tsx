'use client'

import { useEffect, useState } from 'react'
import {
    BarChart3,
    Eye,
    MousePointerClick,
    MessageSquare,
    TrendingUp,
    Instagram,
    Facebook,
    MessageCircle,
    Activity,
    Users,
    Zap
} from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import PageViewsChart from '@/components/dashboard/PageViewsChart'
import ButtonClicksChart from '@/components/dashboard/ButtonClicksChart'
import ReplyUsageChart from '@/components/dashboard/ReplyUsageChart'
import LiveActivityFeed from '@/components/dashboard/LiveActivityFeed'
import PlatformStats from '@/components/dashboard/PlatformStats'
import { getPusherClient, PUSHER_EVENTS, getUserChannel } from '@/lib/pusher'

export default function DashboardPage() {
    const [stats, setStats] = useState({
        pageViews: 0,
        buttonClicks: 0,
        repliesSent: 0,
        remainingReplies: 0,
    })

    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState('7') // 7 or 30 days

    // Fetch initial stats
    useEffect(() => {
        fetchDashboardStats()
    }, [dateRange])

    // Setup real-time updates with Pusher
    useEffect(() => {
        const userId = 'demo-user-123' // Get from auth context
        const pusher = getPusherClient()
        const channel = pusher.subscribe(getUserChannel(userId))

        // Listen for real-time events
        channel.bind(PUSHER_EVENTS.PAGE_VIEW, (data: any) => {
            setStats((prev) => ({
                ...prev,
                pageViews: prev.pageViews + 1,
            }))
        })

        channel.bind(PUSHER_EVENTS.BUTTON_CLICK, (data: any) => {
            setStats((prev) => ({
                ...prev,
                buttonClicks: prev.buttonClicks + 1,
            }))
        })

        channel.bind(PUSHER_EVENTS.REPLY_SENT, (data: any) => {
            setStats((prev) => ({
                ...prev,
                repliesSent: prev.repliesSent + 1,
                remainingReplies: Math.max(0, prev.remainingReplies - 1),
            }))
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }, [])

    async function fetchDashboardStats() {
        setLoading(true)
        try {
            const response = await fetch(`/api/dashboard/stats?days=${dateRange}`)
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-sm bg-white/80">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
                            <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 py-2 border rounded-lg bg-white hover:border-purple-500 transition"
                            >
                                <option value="7">Last 7 Days</option>
                                <option value="30">Last 30 Days</option>
                            </select>
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition">
                                <Activity className="w-4 h-4 inline mr-2" />
                                Live
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Page Views"
                        value={stats.pageViews}
                        icon={Eye}
                        trend={12.5}
                        color="blue"
                        loading={loading}
                    />
                    <StatsCard
                        title="Button Clicks"
                        value={stats.buttonClicks}
                        icon={MousePointerClick}
                        trend={8.3}
                        color="green"
                        loading={loading}
                    />
                    <StatsCard
                        title="Auto-Replies Sent"
                        value={stats.repliesSent}
                        icon={MessageSquare}
                        trend={-2.1}
                        color="purple"
                        loading={loading}
                    />
                    <StatsCard
                        title="Remaining Replies"
                        value={stats.remainingReplies}
                        icon={Zap}
                        subtitle="This month"
                        color="orange"
                        loading={loading}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            Page Views Trend
                        </h3>
                        <PageViewsChart days={parseInt(dateRange)} />
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <MousePointerClick className="w-5 h-5 text-green-600" />
                            Button Clicks
                        </h3>
                        <ButtonClicksChart days={parseInt(dateRange)} />
                    </div>
                </div>

                {/* Reply Usage & Platform Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            Reply Usage by Platform
                        </h3>
                        <ReplyUsageChart />
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            Platform Overview
                        </h3>
                        <PlatformStats />
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                        Live Activity Stream
                    </h3>
                    <LiveActivityFeed />
                </div>
            </main>
        </div>
    )
}
