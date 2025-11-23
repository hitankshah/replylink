import React from 'react'
import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionProps {
    title: string
    description: string
    icon: LucideIcon
    href: string
    gradient: string
}

export function QuickActionsCard({ actions }: { actions: QuickActionProps[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => (
                <Link
                    key={index}
                    href={action.href}
                    className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-all hover:border-white/[0.16]"
                >
                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", action.gradient)} />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.08] text-white group-hover:scale-110 transition-transform">
                            <action.icon className="h-5 w-5" />
                        </div>

                        <h3 className="mb-1 text-lg font-semibold text-white">{action.title}</h3>
                        <p className="mb-4 text-sm text-gray-400 line-clamp-2">{action.description}</p>

                        <div className="mt-auto flex items-center text-sm font-medium text-gray-300 group-hover:text-white">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
