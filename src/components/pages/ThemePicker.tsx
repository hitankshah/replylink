'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const THEMES = [
    { id: 'simple-dark', name: 'Simple Dark', bg: 'bg-[#111]', text: 'text-white', preview: 'bg-[#111]' },
    { id: 'simple-light', name: 'Simple Light', bg: 'bg-white', text: 'text-black', preview: 'bg-white border border-gray-200' },
    { id: 'ocean-blue', name: 'Ocean Blue', bg: 'bg-blue-900', text: 'text-white', preview: 'bg-gradient-to-b from-blue-800 to-blue-900' },
    { id: 'forest-green', name: 'Forest Green', bg: 'bg-emerald-900', text: 'text-white', preview: 'bg-gradient-to-b from-emerald-800 to-emerald-900' },
    { id: 'sunset-purple', name: 'Sunset Purple', bg: 'bg-purple-900', text: 'text-white', preview: 'bg-gradient-to-b from-purple-800 to-purple-900' },
]

interface ThemePickerProps {
    selectedTheme: string
    onSelectTheme: (themeId: string) => void
}

export function ThemePicker({ selectedTheme, onSelectTheme }: ThemePickerProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-white">Theme</Label>
                <span className="text-xs text-gray-400">5 themes available</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {THEMES.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onSelectTheme(theme.id)}
                        className={cn(
                            "group relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all",
                            selectedTheme === theme.id
                                ? "border-blue-500 ring-2 ring-blue-500/20"
                                : "border-transparent hover:border-white/[0.2]"
                        )}
                    >
                        <div className={cn("absolute inset-0", theme.preview)}>
                            {/* Mock Content for Preview */}
                            <div className="flex flex-col items-center justify-center h-full gap-2 p-2 opacity-50">
                                <div className={cn("w-8 h-8 rounded-full", theme.id === 'simple-light' ? 'bg-gray-200' : 'bg-white/20')}></div>
                                <div className={cn("w-16 h-2 rounded-full", theme.id === 'simple-light' ? 'bg-gray-200' : 'bg-white/20')}></div>
                                <div className={cn("w-12 h-2 rounded-full", theme.id === 'simple-light' ? 'bg-gray-200' : 'bg-white/20')}></div>
                            </div>
                        </div>

                        {selectedTheme === theme.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <div className="bg-blue-500 rounded-full p-1">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm text-xs text-white font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {theme.name}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}
