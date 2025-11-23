'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ComparisonToggleProps {
    value: 'previous_period' | 'previous_year' | 'none'
    onChange: (value: 'previous_period' | 'previous_year' | 'none') => void
}

export function ComparisonToggle({ value, onChange }: ComparisonToggleProps) {
    return (
        <div className="flex items-center bg-white/[0.05] p-1 rounded-lg border border-white/[0.08]">
            <button
                onClick={() => onChange('none')}
                className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === 'none'
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                )}
            >
                No Comparison
            </button>
            <button
                onClick={() => onChange('previous_period')}
                className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === 'previous_period'
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                )}
            >
                Prev Period
            </button>
            <button
                onClick={() => onChange('previous_year')}
                className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === 'previous_year'
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                )}
            >
                Prev Year
            </button>
        </div>
    )
}
