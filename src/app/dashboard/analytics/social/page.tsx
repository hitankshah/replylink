'use client'

import React from 'react'
import { ArrowLeft, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ComparisonToggle } from '@/components/analytics/ComparisonToggle'
import { ExportButton } from '@/components/analytics/ExportButton'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

const SOCIAL_DATA = [
    { name: 'Instagram', visits: 4500, color: '#E1306C' },
    { name: 'Facebook', visits: 2300, color: '#1877F2' },
    { name: 'TikTok', visits: 3200, color: '#000000' },
    { name: 'Twitter', visits: 1200, color: '#1DA1F2' },
    { name: 'LinkedIn', visits: 800, color: '#0A66C2' },
    { name: 'YouTube', visits: 1500, color: '#FF0000' },
]

export default function SocialInsightsPage() {
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
                        <h1 className="text-2xl font-bold text-white">Social Insights</h1>
                        <p className="text-sm text-gray-400">
                            Detailed breakdown of traffic from social media platforms.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ComparisonToggle value="previous_period" onChange={() => { }} />
                    <ExportButton />
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-6">Traffic by Platform</h3>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SOCIAL_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{
                                    backgroundColor: '#111',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                                {SOCIAL_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color === '#000000' ? '#333' : entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SOCIAL_DATA.map((platform) => (
                    <div key={platform.name} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                style={{ backgroundColor: platform.color === '#000000' ? '#333' : platform.color }}
                            >
                                {platform.name === 'Instagram' && <Instagram className="w-5 h-5" />}
                                {platform.name === 'Facebook' && <Facebook className="w-5 h-5" />}
                                {platform.name === 'Twitter' && <Twitter className="w-5 h-5" />}
                                {platform.name === 'LinkedIn' && <Linkedin className="w-5 h-5" />}
                                {!['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].includes(platform.name) && (
                                    <span className="font-bold text-xs">{platform.name[0]}</span>
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-white">{platform.name}</p>
                                <p className="text-xs text-gray-400">Social Traffic</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-white">{platform.visits.toLocaleString()}</p>
                            <p className="text-xs text-green-400">+5.2%</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
