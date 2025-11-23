import React from 'react'
import { cn } from '@/lib/utils'

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    subtitle?: string
    action?: React.ReactNode
    children: React.ReactNode
}

export function ChartCard({ title, subtitle, action, children, className, ...props }: ChartCardProps) {
    return (
        <div className={cn("bg-white/[0.03] border border-white/[0.08] rounded-xl p-6", className)} {...props}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
            <div className="w-full">
                {children}
            </div>
        </div>
    )
}
