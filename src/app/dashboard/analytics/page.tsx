'use client'

import React, { useState } from 'react'
import { TrendingUp, Users, MousePointerClick, Globe, ArrowUpRight, ArrowDownRight, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import PageViewsChart from '@/components/dashboard/PageViewsChart'
import ButtonClicksChart from '@/components/dashboard/ButtonClicksChart'
import { TopPerformers } from '@/components/analytics/TopPerformers'
import { RulePerformance } from '@/components/analytics/RulePerformance'
import { RealTimeIndicator } from '@/components/analytics/RealTimeIndicator'
import { CustomReportBuilder } from '@/components/analytics/CustomReportBuilder'
import { ExportButton } from '@/components/analytics/ExportButton'

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('30')

    return (
        <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">Analytics</h1>
                            <RealTimeIndicator />
                        </div>
                        <p className="text-gray-400">Detailed insights into your link performance and audience</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="pl-9 bg-white/[0.05] border border-white/[0.12] rounded-md px-4 py-2 text-sm text-white focus:outline-none focus:border-white/[0.24] appearance-none pr-8"
                            >
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                            </select>
                        </div>
                        <CustomReportBuilder />
                        <ExportButton />
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Views"
                        value="124,592"
                        trend="+12.5%"
                        trendUp={true}
                        icon={<TrendingUp className="w-5 h-5" />}
                    />
                    <MetricCard
                        title="Unique Visitors"
                        value="85,204"
                        trend="+8.2%"
                        trendUp={true}
                        icon={<Users className="w-5 h-5" />}
                    />
                    <MetricCard
                        title="Click Rate (CTR)"
                        value="42.8%"
                        trend="-2.1%"
                        trendUp={false}
                        icon={<MousePointerClick className="w-5 h-5" />}
                    />
                    <MetricCard
                        title="Avg. Time on Page"
                        value="1m 32s"
                        trend="+5.4%"
                        trendUp={true}
                        icon={<Globe className="w-5 h-5" />}
                    />
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Page Views Over Time</h3>
                            <Link href="/dashboard/analytics/pages/1" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                View Details <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="h-[300px]">
                            <PageViewsChart />
                        </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-6">Button Clicks</h3>
                        <div className="h-[300px]">
                            <ButtonClicksChart />
                        </div>
                    </div>
                </div>

                {/* Performance & Rules */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TopPerformers />
                    <RulePerformance />
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Top Locations</h3>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">View Map</Button>
                        </div>
                        <div className="space-y-4">
                            <LocationBar country="United States" percentage={45} count="56,231" />
                            <LocationBar country="United Kingdom" percentage={15} count="18,402" />
                            <LocationBar country="Canada" percentage={12} count="14,205" />
                            <LocationBar country="Germany" percentage={8} count="9,842" />
                            <LocationBar country="India" percentage={5} count="6,120" />
                        </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold">Social Traffic</h3>
                            <Link href="/dashboard/analytics/social" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                Full Report <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-6">
                            <DeviceStat device="Instagram" percentage={68} icon="Instagram" />
                            <DeviceStat device="TikTok" percentage={28} icon="TikTok" />
                            <DeviceStat device="Twitter" percentage={4} icon="Twitter" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, trend, trendUp, icon }: {
    title: string
    value: string
    trend: string
    trendUp: boolean
    icon: React.ReactNode
}) {
    return (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6 hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-md bg-white/[0.05] text-gray-400">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                    {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend}
                </div>
            </div>
            <div>
                <p className="text-gray-400 text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    )
}

function LocationBar({ country, percentage, count }: { country: string, percentage: number, count: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-300">{country}</div>
            <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
            <div className="w-16 text-right text-sm text-gray-400">{percentage}%</div>
        </div>
    )
}

function DeviceStat({ device, percentage, icon }: { device: string, percentage: number, icon: string }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-sm font-bold text-gray-400">
                    {icon[0]}
                </div>
                <span className="text-gray-300">{device}</span>
            </div>
            <div className="text-right">
                <div className="text-white font-bold">{percentage}%</div>
            </div>
        </div>
    )
}
