'use client'

import { LucideIcon } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: number
    icon: LucideIcon
    trend?: number
    subtitle?: string
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
    loading?: boolean
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
}

export default function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    subtitle,
    color,
    loading = false,
}: StatsCardProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend !== undefined && (
                    <div
                        className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {trend >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                        ) : (
                            <TrendingDown className="w-4 h-4" />
                        )}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
                {loading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
                ) : (
                    <p className="text-3xl font-bold text-gray-900">{formatNumber(value)}</p>
                )}
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    )
}
