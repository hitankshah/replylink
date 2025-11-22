'use client'

import React, { useEffect, useState } from 'react'
import {
  BarChart3, Eye, MousePointerClick, MessageSquare, TrendingUp,
  Instagram, Facebook, MessageCircle, Activity, Users, Zap,
  QrCode, Scissors, Link2, Palette, Users2, GitBranch, Globe,
  CreditCard, Lock, ArrowRight, Settings, Plus
} from 'lucide-react'
import Link from 'next/link'
import StatsCard from '@/components/dashboard/StatsCard'
import PageViewsChart from '@/components/dashboard/PageViewsChart'
import ButtonClicksChart from '@/components/dashboard/ButtonClicksChart'
import ReplyUsageChart from '@/components/dashboard/ReplyUsageChart'
import LiveActivityFeed from '@/components/dashboard/LiveActivityFeed'
import PlatformStats from '@/components/dashboard/PlatformStats'

interface FeatureWidget {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color: string
  badge?: string
}

const QUICK_FEATURES: FeatureWidget[] = [
  {
    icon: <QrCode className="w-6 h-6" />,
    title: 'QR Code',
    description: 'Generate custom QR codes',
    href: '/dashboard/qr-code',
    color: 'from-blue-600 to-blue-700',
    badge: 'NEW'
  },
  {
    icon: <Scissors className="w-6 h-6" />,
    title: 'Short Links',
    description: 'Create shortened URLs',
    href: '/dashboard/short-links',
    color: 'from-purple-600 to-purple-700'
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Auto-Reply',
    description: 'Setup auto-reply rules',
    href: '/dashboard/rules',
    color: 'from-green-600 to-green-700'
  },
  {
    icon: <Link2 className="w-6 h-6" />,
    title: 'Pages',
    description: 'Create link pages',
    href: '/dashboard/pages',
    color: 'from-pink-600 to-pink-700'
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Analytics',
    description: 'View detailed analytics',
    href: '/dashboard/analytics',
    color: 'from-cyan-600 to-cyan-700'
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Accounts',
    description: 'Connect social accounts',
    href: '/dashboard/accounts',
    color: 'from-orange-600 to-orange-700'
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Branding',
    description: 'Customize your brand',
    href: '/dashboard/branding',
    color: 'from-rose-600 to-rose-700'
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: 'Advanced Rules',
    description: 'Create complex rules',
    href: '/dashboard/advanced-rules',
    color: 'from-indigo-600 to-indigo-700'
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Domains',
    description: 'Setup custom domains',
    href: '/dashboard/domains',
    color: 'from-teal-600 to-teal-700'
  },
  {
    icon: <Users2 className="w-6 h-6" />,
    title: 'Collaborators',
    description: 'Manage team members',
    href: '/dashboard/collaborators',
    color: 'from-yellow-600 to-yellow-700'
  }
]

interface DashboardStats {
  pageViews: number
  buttonClicks: number
  repliesSent: number
  remainingReplies: number
  connectedAccounts: number
  activeRules: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    pageViews: 12453,
    buttonClicks: 3421,
    repliesSent: 856,
    remainingReplies: 1144,
    connectedAccounts: 3,
    activeRules: 12
  })

  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7')

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [dateRange])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back! Here's your overview and quick access to all features.</p>
        </div>

        {/* Main Stats Row */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={<Eye className="w-5 h-5" />}
            label="Page Views"
            value={stats.pageViews.toLocaleString()}
            change="+12.5%"
            color="text-blue-400"
          />
          <StatsCard
            icon={<MousePointerClick className="w-5 h-5" />}
            label="Button Clicks"
            value={stats.buttonClicks.toLocaleString()}
            change="+8.2%"
            color="text-purple-400"
          />
          <StatsCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Replies Sent"
            value={stats.repliesSent.toLocaleString()}
            change="+15.3%"
            color="text-green-400"
          />
          <StatsCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Plan Usage"
            value={`${stats.repliesSent}/${stats.repliesSent + stats.remainingReplies}`}
            change={`${Math.round((stats.repliesSent / (stats.repliesSent + stats.remainingReplies)) * 100)}%`}
            color="text-cyan-400"
          />
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Page Views</h3>
            <PageViewsChart />
          </div>
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Button Clicks</h3>
            <ButtonClicksChart />
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Quick Access Tools</h2>
              <p className="text-slate-400 text-sm">All your features in one place</p>
            </div>
            <Link
              href="/functionality"
              className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-2"
            >
              View All Features <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUICK_FEATURES.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className={`group bg-gradient-to-br ${feature.color} rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-1`}
              >
                <div className="relative">
                  {feature.badge && (
                    <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {feature.badge}
                    </span>
                  )}
                  <div className="text-white mb-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                  <p className="text-white/80 text-xs mt-1">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Platform Stats and Activity */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Activity</h3>
              <LiveActivityFeed />
            </div>
          </div>
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Connected Platforms</h3>
            <PlatformStats />
          </div>
        </div>

        {/* Bottom Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Connected Accounts</h3>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.connectedAccounts}</p>
            <Link
              href="/dashboard/accounts"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
            >
              Manage Accounts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Active Rules</h3>
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.activeRules}</p>
            <Link
              href="/dashboard/rules"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
            >
              View Rules <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Reply Quota</h3>
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.remainingReplies}</p>
            <Link
              href="/dashboard/billing"
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
            >
              Upgrade Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Reply Usage Chart */}
        <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Reply Usage by Platform</h3>
          <ReplyUsageChart />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600/30 to-blue-600/30 border border-emerald-500/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Need More Power?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Upgrade your plan to unlock unlimited features, more social accounts, and advanced automation
          </p>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View Plans <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
