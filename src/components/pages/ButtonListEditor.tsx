'use client'

import React, { useState } from 'react'
import { GripVertical, Trash2, Edit2, Plus, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

interface LinkButton {
    id: string
    title: string
    url: string
    isActive: boolean
}

export function ButtonListEditor() {
    const [buttons, setButtons] = useState<LinkButton[]>([
        { id: '1', title: 'My Website', url: 'https://example.com', isActive: true },
        { id: '2', title: 'Latest Video', url: 'https://youtube.com', isActive: true },
        { id: '3', title: 'Instagram', url: 'https://instagram.com', isActive: false },
    ])

    const addButton = () => {
        const newButton = {
            id: Date.now().toString(),
            title: 'New Link',
            url: '',
            isActive: true,
        }
        setButtons([...buttons, newButton])
    }

    const removeButton = (id: string) => {
        setButtons(buttons.filter(b => b.id !== id))
    }

    const updateButton = (id: string, updates: Partial<LinkButton>) => {
        setButtons(buttons.map(b => b.id === id ? { ...b, ...updates } : b))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-white">Links</Label>
                <Button onClick={addButton} size="sm" className="bg-white text-black hover:bg-gray-100">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                </Button>
            </div>

            <div className="space-y-3">
                {buttons.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-white/[0.1] rounded-xl">
                        <p className="text-gray-400 text-sm">No links yet. Add one to get started!</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="space-y-3">
                        {buttons.map((button, index) => (
                            <div key={button.id} className="group bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden transition-all hover:border-white/[0.16]">
                                <div className="flex items-center p-3 gap-3">
                                    <div className="cursor-grab text-gray-500 hover:text-white">
                                        <GripVertical className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white truncate">{button.title}</div>
                                        <div className="text-xs text-gray-500 truncate">{button.url || 'No URL set'}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={button.isActive}
                                            onCheckedChange={(c) => updateButton(button.id, { isActive: c })}
                                        />
                                        <AccordionTrigger className="p-2 hover:bg-white/[0.05] rounded-md">
                                            <Edit2 className="w-4 h-4 text-gray-400" />
                                        </AccordionTrigger>
                                    </div>
                                </div>

                                <AccordionContent className="border-t border-white/[0.08] bg-black/20 p-4 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-400">Title</Label>
                                        <Input
                                            value={button.title}
                                            onChange={(e) => updateButton(button.id, { title: e.target.value })}
                                            className="bg-white/[0.05] border-white/[0.12] text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs text-gray-400">URL</Label>
                                        <Input
                                            value={button.url}
                                            onChange={(e) => updateButton(button.id, { url: e.target.value })}
                                            className="bg-white/[0.05] border-white/[0.12] text-white"
                                            placeholder="https://"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                            <ImageIcon className="w-4 h-4 mr-2" />
                                            Add Thumbnail
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                            onClick={() => removeButton(button.id)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </div>
                        ))}
                    </Accordion>
                )}
            </div>
        </div>
    )
}
