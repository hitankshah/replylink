'use client'

import React from 'react'
import { Save, Share2, ExternalLink, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PublishBarProps {
    isSaving?: boolean
    hasChanges?: boolean
    onSave: () => void
    onPublish: () => void
    pageUrl: string
}

export function PublishBar({ isSaving, hasChanges, onSave, onPublish, pageUrl }: PublishBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111] border-t border-white/[0.12] p-4 lg:pl-[280px]">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className={hasChanges ? "text-yellow-400" : "text-green-400"}>
                        {hasChanges ? "Unsaved changes" : "All changes saved"}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 hover:text-white transition-colors">
                        {pageUrl}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={onSave}
                        disabled={!hasChanges || isSaving}
                        className="bg-transparent border-white/[0.12] text-white hover:bg-white/[0.05]"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Draft
                    </Button>
                    <Button
                        onClick={onPublish}
                        className="bg-white text-black hover:bg-gray-100 font-medium"
                    >
                        <Share2 className="w-4 h-4 mr-2" />
                        Publish
                    </Button>
                </div>
            </div>
        </div>
    )
}
