'use client'

import React from 'react'
import { ExternalLink, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopPerformer {
    id: string
    title: string
    url: string
    clicks: number
    ctr: number
}

const MOCK_DATA: TopPerformer[] = [
    { id: '1', title: 'My Portfolio', url: 'https://portfolio.com', clicks: 1245, ctr: 12.5 },
    { id: '2', title: 'Latest YouTube Video', url: 'https://youtube.com/watch?v=...', clicks: 856, ctr: 8.2 },
    { id: '3', title: 'Book Consultation', url: 'https://cal.com/me', clicks: 654, ctr: 6.1 },
    { id: '4', title: 'Instagram Profile', url: 'https://instagram.com/me', clicks: 432, ctr: 4.5 },
    { id: '5', title: 'Newsletter Signup', url: 'https://substack.com/@me', clicks: 321, ctr: 3.2 },
]

export function TopPerformers() {
    const maxClicks = Math.max(...MOCK_DATA.map(d => d.clicks))

    return (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Top Performing Links</h3>
                <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
            </div>

            <div className="space-y-6">
                {MOCK_DATA.map((item) => (
                    <div key={item.id} className="group">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1.5 bg-white/[0.05] rounded-md text-gray-400 group-hover:text-white transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500 truncate">{item.url}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{item.clicks.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{item.ctr}% CTR</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${(item.clicks / maxClicks) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
