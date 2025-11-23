import React from 'react'
import { cn } from '@/lib/utils'

interface PageEditorLayoutProps {
    children: React.ReactNode
    preview: React.ReactNode
    sidebar?: React.ReactNode
}

export function PageEditorLayout({ children, preview, sidebar }: PageEditorLayoutProps) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[hsl(0,0%,4%)]">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-white/[0.08]">
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-2xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Preview Area - Hidden on mobile, visible on lg screens */}
            <div className="hidden lg:flex w-[400px] xl:w-[480px] bg-black items-center justify-center p-8 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="relative w-full max-w-[375px] aspect-[9/19] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900">
                    {/* Phone Frame Content */}
                    <div className="h-full w-full overflow-y-auto scrollbar-hide bg-white">
                        {preview}
                    </div>
                    {/* Phone Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-7 bg-gray-900 rounded-b-2xl z-20"></div>
                </div>
            </div>
        </div>
    )
}
