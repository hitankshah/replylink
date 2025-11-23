'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const TEMPLATES = [
    { id: 'minimal', name: 'Minimal', image: 'https://placehold.co/300x500/111/fff?text=Minimal' },
    { id: 'creative', name: 'Creative', image: 'https://placehold.co/300x500/3b82f6/fff?text=Creative' },
    { id: 'professional', name: 'Professional', image: 'https://placehold.co/300x500/0f172a/fff?text=Pro' },
    { id: 'influencer', name: 'Influencer', image: 'https://placehold.co/300x500/ec4899/fff?text=Influencer' },
]

interface TemplateGalleryProps {
    selectedTemplate: string
    onSelectTemplate: (id: string) => void
}

export function TemplateGallery({ selectedTemplate, onSelectTemplate }: TemplateGalleryProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEMPLATES.map((template) => (
                <button
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    className={cn(
                        "group relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all text-left",
                        selectedTemplate === template.id
                            ? "border-blue-500 ring-2 ring-blue-500/20"
                            : "border-transparent hover:border-white/[0.2]"
                    )}
                >
                    <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    )}

                    <div className="absolute bottom-3 left-3 text-white font-medium text-sm">
                        {template.name}
                    </div>
                </button>
            ))}
        </div>
    )
}
