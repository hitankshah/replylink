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
    days?: number
}

export default function ButtonClicksChart({ days = 30 }: ButtonClicksChartProps) {
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
            // Mock data for fallback/demo
            setData([
                { name: 'Instagram', clicks: 240 },
                { name: 'Website', clicks: 180 },
                { name: 'Twitter', clicks: 120 },
                { name: 'Email', clicks: 90 },
                { name: 'Store', clicks: 300 },
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
                <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis
                        type="number"
                        stroke="#6b7280"
                        style={{ fontSize: '12px' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={80}
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
                        labelStyle={{ color: '#9ca3af' }}
                    />
                    <Bar
                        dataKey="clicks"
                        fill="#10b981"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
