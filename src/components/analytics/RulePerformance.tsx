'use client'

import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const DATA = [
    { time: '00:00', success: 45, failed: 2 },
    { time: '04:00', success: 30, failed: 1 },
    { time: '08:00', success: 65, failed: 5 },
    { time: '12:00', success: 85, failed: 3 },
    { time: '16:00', success: 70, failed: 4 },
    { time: '20:00', success: 50, failed: 2 },
    { time: '23:59', success: 40, failed: 1 },
]

export function RulePerformance() {
    return (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">Rule Execution Performance</h3>
                <p className="text-sm text-gray-400">Success vs Failed executions over time</p>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="time"
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
                            contentStyle={{
                                backgroundColor: '#111',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="success"
                            stroke="#22c55e"
                            fillOpacity={1}
                            fill="url(#colorSuccess)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="failed"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#colorFailed)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
