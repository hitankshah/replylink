'use client'

import { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface PageViewsChartProps {
    days?: number
}

export default function PageViewsChart({ days = 30 }: PageViewsChartProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPageViewsData()
    }, [days])

    async function fetchPageViewsData() {
        setLoading(true)
        try {
            const response = await fetch(`/api/analytics/page-views?days=${days}`)
            const result = await response.json()
            setData(result.data || [])
        } catch (error) {
            console.error('Failed to fetch page views:', error)
            // Mock data for fallback/demo
            setData([
                { name: 'Mon', views: 400 },
                { name: 'Tue', views: 300 },
                { name: 'Wed', views: 550 },
                { name: 'Thu', views: 450 },
                { name: 'Fri', views: 600 },
                { name: 'Sat', views: 700 },
                { name: 'Sun', views: 800 },
            ])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading chart...</div>
            </div>
        )
    }

    return (
        <div className="h-full w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#111',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#9ca3af' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#111', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#3b82f6' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
