import React from 'react'
import { cn } from '@/lib/utils'

interface PreviewFrameProps {
    url?: string
    theme?: string
    children?: React.ReactNode
}

export function PreviewFrame({ url, theme, children }: PreviewFrameProps) {
    return (
        <div className="w-full h-full bg-white text-black overflow-hidden relative">
            {/* Mock Browser Bar if needed, or just content */}
            {/* Content */}
            <div className={cn("h-full w-full overflow-y-auto", theme)}>
                {children ? children : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-full space-y-3 mt-8">
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
