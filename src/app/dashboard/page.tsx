'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    BarChart3,
    Eye,
    MousePointerClick,
    MessageSquare,
    TrendingUp,
    Activity,
    Loader,
    ArrowUpRight,
    ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { getPusherClient, PUSHER_EVENTS, getUserChannel } from '@/lib/pusher'

export default function DashboardPage() {
    const router = useRouter()
    const [stats, setStats] = useState({
        pageViews: 0,
        buttonClicks: 0,
        repliesSent: 0,
        remainingReplies: 0,
    })

    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [dateRange, setDateRange] = useState('7')

    // Fetch user and stats
    useEffect(() => {
        fetchUserAndStats()
    }, [dateRange])

    async function fetchUserAndStats() {
        setLoading(true)
        try {
            const userRes = await fetch('/api/auth/me', {
                credentials: 'include'
            })

            if (!userRes.ok) {
                router.push('/auth/login')
                return
            }

            const userData = await userRes.json()
            setUser(userData.user)

            const statsRes = await fetch(`/api/dashboard/stats?days=${dateRange}`, {
                credentials: 'include'
            })

            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }
        } catch (error) {
            console.error('Failed to fetch user/stats:', error)
            router.push('/auth/login')
        } finally {
            setLoading(false)
        }
    }

    // Setup real-time updates with Pusher
    useEffect(() => {
        if (!user) return

        try {
            const pusher = getPusherClient()
            const channel = pusher.subscribe(getUserChannel(user.id))

            channel.bind(PUSHER_EVENTS.PAGE_VIEW, (data: any) => {
                setStats(prev => ({
                    ...prev,
                    pageViews: prev.pageViews + 1
                }))
            })

            channel.bind(PUSHER_EVENTS.BUTTON_CLICK, (data: any) => {
                setStats(prev => ({
                    ...prev,
                    buttonClicks: prev.buttonClicks + 1
                }))
            })

            channel.bind(PUSHER_EVENTS.REPLY_SENT, (data: any) => {
                setStats(prev => ({
                    ...prev,
                    repliesSent: prev.repliesSent + 1,
                    remainingReplies: Math.max(0, prev.remainingReplies - 1)
                }))
            })

            return () => {
                channel.unbind_all()
                pusher.unsubscribe(getUserChannel(user.id))
            }
        } catch (error) {
            console.error('Pusher setup error:', error)
        }
    }, [user])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[hsl(0,0%,4%)]">
                <Loader className="w-8 h-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-gray-400 mt-1">Welcome back, {user?.name || 'User'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-white/[0.05] border border-white/[0.12] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-white/[0.24]"
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Page Views"
                        value={stats.pageViews.toLocaleString()}
                        icon={<Eye className="w-5 h-5" />}
                        trend="+12.5%"
                        href="/dashboard/analytics"
                    />
                    <StatCard
                        title="Button Clicks"
                        value={stats.buttonClicks.toLocaleString()}
                        icon={<MousePointerClick className="w-5 h-5" />}
                        trend="+8.2%"
                        href="/dashboard/analytics"
                    />
                    <StatCard
                        title="Replies Sent"
                        value={stats.repliesSent.toLocaleString()}
                        icon={<MessageSquare className="w-5 h-5" />}
                        trend="+23.1%"
                        href="/dashboard/rules"
                    />
                    <StatCard
                        title="Remaining Replies"
                        value={stats.remainingReplies.toLocaleString()}
                        icon={<Activity className="w-5 h-5" />}
                        subtitle={`of ${(stats.repliesSent + stats.remainingReplies).toLocaleString()}`}
                        href="/dashboard/billing"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickActionCard
                        title="Create Link Page"
                        description="Build a new branded link page"
                        href="/dashboard/pages/new"
                        icon={<BarChart3 className="w-5 h-5" />}
                    />
                    <QuickActionCard
                        title="Setup Auto-Reply"
                        description="Create automation rules"
                        href="/dashboard/rules/new"
                        icon={<MessageSquare className="w-5 h-5" />}
                    />
                    <QuickActionCard
                        title="View Analytics"
                        description="Check your performance"
                        href="/dashboard/analytics"
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                </div>

                {/* Recent Activity */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Recent Activity</h2>
                        <Link
                            href="/dashboard/analytics"
                            className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            View all
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        <ActivityItem
                            type="view"
                            message="New page view on your link"
                            time="2 minutes ago"
                        />
                        <ActivityItem
                            type="click"
                            message="Button clicked on 'Instagram'"
                            time="5 minutes ago"
                        />
                        <ActivityItem
                            type="reply"
                            message="Auto-reply sent via WhatsApp"
                            time="12 minutes ago"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, trend, subtitle, href }: {
    title: string
    value: string
    icon: React.ReactNode
    trend?: string
    subtitle?: string
    href: string
}) {
    return (
        <Link href={href} className="block group">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 hover:border-white/[0.16] hover:bg-white/[0.05] transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-400">{icon}</div>
                    {trend && (
                        <div className="flex items-center gap-1 text-xs text-green-500">
                            <ArrowUpRight className="w-3 h-3" />
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-gray-400 text-sm mb-1">{title}</p>
                    <p className="text-3xl font-bold">
                        {value}
                        {subtitle && <span className="text-sm text-gray-500 ml-2">{subtitle}</span>}
                    </p>
                </div>
            </div>
        </Link>
    )
}

function QuickActionCard({ title, description, href, icon }: {
    title: string
    description: string
    href: string
    icon: React.ReactNode
}) {
    return (
        <Link href={href} className="block group">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 hover:border-white/[0.16] hover:bg-white/[0.05] transition-all">
                <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-md bg-white/[0.05] text-blue-500 group-hover:bg-white/[0.08] transition-colors">
                        {icon}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </Link>
    )
}

function ActivityItem({ type, message, time }: {
    type: 'view' | 'click' | 'reply'
    message: string
    time: string
}) {
    const icons = {
        view: <Eye className="w-4 h-4 text-blue-500" />,
        click: <MousePointerClick className="w-4 h-4 text-green-500" />,
        reply: <MessageSquare className="w-4 h-4 text-purple-500" />
    }

    return (
        <div className="flex items-start gap-3 py-3 border-b border-white/[0.08] last:border-0">
            <div className="p-2 rounded-md bg-white/[0.05]">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-sm">{message}</p>
                <p className="text-xs text-gray-500 mt-1">{time}</p>
            </div>
        </div>
    )
}
