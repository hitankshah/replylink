'use client'

import React from 'react'
import { ArrowLeft, Calendar, Smartphone, Globe, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChartCard } from '@/components/dashboard/ChartCard'
import { PageViewsChart } from '@/components/dashboard/PageViewsChart'
import { ButtonClicksChart } from '@/components/dashboard/ButtonClicksChart'
import { ComparisonToggle } from '@/components/analytics/ComparisonToggle'
import { ExportButton } from '@/components/analytics/ExportButton'

export default function PageAnalyticsDetail({ params }: { params: { id: string } }) {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[hsl(0,0%,4%)] text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/analytics">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/[0.05]">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Portfolio Link</h1>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            replylink.to/{params.id}
                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                            Created Oct 2023
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ComparisonToggle value="previous_period" onChange={() => { }} />
                    <ExportButton />
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <p className="text-sm text-gray-400 mb-1">Total Views</p>
                    <p className="text-2xl font-bold text-white">12,450</p>
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        +12% <span className="text-gray-500">vs prev period</span>
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <p className="text-sm text-gray-400 mb-1">Unique Visitors</p>
                    <p className="text-2xl font-bold text-white">8,320</p>
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        +8% <span className="text-gray-500">vs prev period</span>
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <p className="text-sm text-gray-400 mb-1">Total Clicks</p>
                    <p className="text-2xl font-bold text-white">4,105</p>
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        +15% <span className="text-gray-500">vs prev period</span>
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                    <p className="text-sm text-gray-400 mb-1">CTR</p>
                    <p className="text-2xl font-bold text-white">32.9%</p>
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        -2% <span className="text-gray-500">vs prev period</span>
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Views Over Time">
                    <PageViewsChart />
                </ChartCard>
                <ChartCard title="Clicks Breakdown">
                    <ButtonClicksChart />
                </ChartCard>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Device Breakdown */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Smartphone className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">Devices</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Mobile</span>
                            <span className="text-sm font-medium text-white">85%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[85%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Desktop</span>
                            <span className="text-sm font-medium text-white">12%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[12%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Tablet</span>
                            <span className="text-sm font-medium text-white">3%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[3%]"></div>
                        </div>
                    </div>
                </div>

                {/* Location Breakdown */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Globe className="w-5 h-5 text-purple-400" />
                        <h3 className="font-semibold text-white">Top Locations</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">United States</span>
                            <span className="text-sm font-medium text-white">45%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[45%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">India</span>
                            <span className="text-sm font-medium text-white">25%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[25%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">United Kingdom</span>
                            <span className="text-sm font-medium text-white">10%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[10%]"></div>
                        </div>
                    </div>
                </div>

                {/* Referrer Breakdown */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <MousePointerClick className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-white">Top Referrers</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Instagram</span>
                            <span className="text-sm font-medium text-white">60%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[60%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">TikTok</span>
                            <span className="text-sm font-medium text-white">20%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[20%]"></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Direct</span>
                            <span className="text-sm font-medium text-white">15%</span>
                        </div>
                        <div className="w-full h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[15%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
