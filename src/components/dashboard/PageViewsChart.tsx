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
    days: number
}

export default function PageViewsChart({ days }: PageViewsChartProps) {
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
            setData(result.data || generateDemoData())
        } catch (error) {
            console.error('Failed to fetch page views:', error)
            setData(generateDemoData())
        } finally {
            setLoading(false)
        }
    }

    function generateDemoData() {
        const labels = days === 7
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)

        return labels.map((label) => ({
            name: label,
            views: Math.floor(Math.random() * 500) + 100,
        }))
    }

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading chart...</div>
            </div>
        )
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
