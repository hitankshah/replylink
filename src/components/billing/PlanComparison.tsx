'use client'

import React from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PLANS = [
    {
        name: 'Free',
        price: '₹0',
        period: '/mo',
        description: 'For individuals just getting started',
        features: [
            'Unlimited Links',
            'Basic Analytics',
            'Standard Themes',
            '1 Auto-Reply Rule',
            'ReplyLink Branding'
        ],
        current: false,
        popular: false
    },
    {
        name: 'Starter',
        price: '₹220',
        period: '/mo',
        description: 'For creators growing their audience',
        features: [
            'Everything in Free',
            'Custom Themes',
            'Remove Branding',
            '5 Auto-Reply Rules',
            'Priority Support'
        ],
        current: true,
        popular: false
    },
    {
        name: 'Pro',
        price: '₹440',
        period: '/mo',
        description: 'For professionals and small businesses',
        features: [
            'Everything in Starter',
            'Advanced Analytics',
            'Unlimited Auto-Replies',
            'Team Members',
            'Custom Domain'
        ],
        current: false,
        popular: true
    }
]

export function PlanComparison() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
                <div
                    key={plan.name}
                    className={cn(
                        "relative p-6 rounded-xl border bg-white/[0.03] flex flex-col",
                        plan.popular ? "border-blue-500/50 shadow-lg shadow-blue-500/10" : "border-white/[0.08]",
                        plan.current ? "ring-2 ring-white/20" : ""
                    )}
                >
                    {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                            MOST POPULAR
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                            <span className="text-3xl font-bold text-white">{plan.price}</span>
                            <span className="text-sm text-gray-400">{plan.period}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
                    </div>

                    <div className="flex-1 space-y-4 mb-8">
                        {plan.features.map((feature) => (
                            <div key={feature} className="flex items-start gap-3">
                                <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        className={cn(
                            "w-full font-medium",
                            plan.current
                                ? "bg-white/[0.1] text-white hover:bg-white/[0.15] cursor-default"
                                : plan.popular
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-white text-black hover:bg-gray-100"
                        )}
                        disabled={plan.current}
                    >
                        {plan.current ? 'Current Plan' : 'Upgrade'}
                    </Button>
                </div>
            ))}
        </div>
    )
}
