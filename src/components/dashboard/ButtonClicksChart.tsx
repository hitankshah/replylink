'use client'

import { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'

interface ButtonClicksChartProps {
    days: number
}

export default function ButtonClicksChart({ days }: ButtonClicksChartProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchButtonClicksData()
    }, [days])

    async function fetchButtonClicksData() {
        setLoading(true)
        try {
            const response = await fetch(`/api/analytics/button-clicks?days=${days}`)
            const result = await response.json()
            setData(result.data || [])
        } catch (error) {
            console.error('Failed to fetch button clicks:', error)
            setData([])
        } finally {
            setLoading(false)
        }
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
                <BarChart data={data}>
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
                    <Bar
                        dataKey="clicks"
                        fill="#10b981"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
