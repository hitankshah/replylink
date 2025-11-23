import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RuleBuilderLayoutProps {
    children: React.ReactNode
    sidebar?: React.ReactNode
    title: string
    onSave: () => void
    isSaving?: boolean
}

export function RuleBuilderLayout({ children, sidebar, title, onSave, isSaving }: RuleBuilderLayoutProps) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[hsl(0,0%,4%)]">
            {/* Main Builder Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <div className="h-16 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[hsl(0,0%,4%)]">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/rules">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/[0.05]">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <h1 className="text-lg font-semibold text-white">{title}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="border-white/[0.12] text-white hover:bg-white/[0.05]"
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={isSaving}
                            className="bg-white text-black hover:bg-gray-100"
                        >
                            {isSaving ? 'Saving...' : 'Save Rule'}
                        </Button>
                    </div>
                </div>

                {/* Canvas/Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {children}
                    </div>
                </div>
            </div>

            {/* Right Sidebar (Test Panel / Context) */}
            {sidebar && (
                <div className="w-[350px] border-l border-white/[0.08] bg-[#0A0A0A] flex flex-col">
                    {sidebar}
                </div>
            )}
        </div>
    )
}
