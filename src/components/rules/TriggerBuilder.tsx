'use client'

import React from 'react'
import { Zap, MessageCircle, Search, Clock } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'

export function TriggerBuilder() {
    return (
        <Card className="bg-[#111] border-white/[0.12] p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                    <Zap className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Trigger</h3>
                    <p className="text-sm text-gray-400">When should this rule run?</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-300">Platform</Label>
                    <Select defaultValue="instagram">
                        <SelectTrigger className="bg-white/[0.05] border-white/[0.12] text-white">
                            <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#111] border-white/[0.12] text-white">
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-300">Event Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-blue-500/50 bg-blue-500/10 text-white transition-all">
                            <MessageCircle className="w-6 h-6 text-blue-400" />
                            <span className="text-sm font-medium">Comment</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-white/[0.08] bg-white/[0.03] text-gray-400 hover:bg-white/[0.05] hover:text-white transition-all">
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-sm font-medium">Direct Message</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-300">Keywords (Optional)</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="e.g. 'price', 'info', 'link'"
                            className="pl-9 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-600"
                        />
                    </div>
                    <p className="text-xs text-gray-500">Leave empty to trigger on all comments</p>
                </div>
            </div>
        </Card>
    )
}
