'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RuleBuilderLayout } from '@/components/rules/RuleBuilderLayout'
import { TriggerBuilder } from '@/components/rules/TriggerBuilder'
import { ActionBuilder } from '@/components/rules/ActionBuilder'
import { RuleTestPanel } from '@/components/rules/RuleTestPanel'
import { ArrowDown } from 'lucide-react'

export default function NewRulePage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        router.push('/dashboard/rules')
    }

    return (
        <RuleBuilderLayout
            title="Create New Rule"
            onSave={handleSave}
            isSaving={isSaving}
            sidebar={<RuleTestPanel />}
        >
            {/* Trigger Section */}
            <div className="relative">
                <TriggerBuilder />

                {/* Connector Line */}
                <div className="absolute left-8 -bottom-8 w-0.5 h-8 bg-white/[0.12] z-0"></div>
                <div className="absolute left-6 -bottom-4 z-10 bg-[#111] p-1 rounded-full border border-white/[0.12]">
                    <ArrowDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Action Section */}
            <ActionBuilder />
        </RuleBuilderLayout>
    )
}
