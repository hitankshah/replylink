'use client'

import React from 'react'
import { Send, Link as LinkIcon, Image as ImageIcon, MessageSquare } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ActionBuilder() {
    return (
        <Card className="bg-[#111] border-white/[0.12] p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <Send className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Action</h3>
                    <p className="text-sm text-gray-400">What should happen?</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-300">Reply Message</Label>
                    <div className="relative">
                        <Textarea
                            placeholder="Hey! Thanks for your comment. Here is the link you asked for..."
                            className="min-h-[120px] bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-600 resize-none p-4"
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/[0.1]">
                                <LinkIcon className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/[0.1]">
                                <ImageIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 flex justify-between">
                        <span>Supports basic formatting</span>
                        <span>0/500 chars</span>
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-400">AI Enhancement Available</h4>
                            <p className="text-xs text-blue-300/70 mt-1">
                                Enable AI to automatically personalize this message based on the user's comment context.
                            </p>
                        </div>
                        <Button size="sm" variant="outline" className="ml-auto border-blue-500/30 text-blue-400 hover:bg-blue-500/20">
                            Enable
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
