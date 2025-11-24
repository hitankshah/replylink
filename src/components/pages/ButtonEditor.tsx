"use client"

import React from "react"
import {
  GripVertical,
  Trash2,
  Plus,
  Link as LinkIcon,
  Instagram,
  Facebook,
  Mail,
  Phone,
  Globe,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export type ButtonType = 'URL' | 'WHATSAPP' | 'CALL' | 'EMAIL' | 'INSTAGRAM' | 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'TIKTOK' | 'YOUTUBE'

export interface LinkButton {
  id: string
  type: ButtonType
  label: string
  value: string
  isActive: boolean
}

interface ButtonEditorProps {
  buttons: LinkButton[]
  onChange: (buttons: LinkButton[]) => void
}

const BUTTON_TYPES: { type: ButtonType; icon: React.ElementType; label: string; placeholder: string }[] = [
  { type: 'URL', icon: LinkIcon, label: 'Website URL', placeholder: 'https://example.com' },
  { type: 'INSTAGRAM', icon: Instagram, label: 'Instagram', placeholder: 'username' },
  { type: 'FACEBOOK', icon: Facebook, label: 'Facebook', placeholder: 'username' },
  { type: 'TWITTER', icon: Globe, label: 'Twitter/X', placeholder: 'username' },
  { type: 'LINKEDIN', icon: Globe, label: 'LinkedIn', placeholder: 'username' },
  { type: 'TIKTOK', icon: Globe, label: 'TikTok', placeholder: '@username' },
  { type: 'YOUTUBE', icon: Globe, label: 'YouTube', placeholder: '@channel' },
  { type: 'WHATSAPP', icon: Phone, label: 'WhatsApp', placeholder: '1234567890' },
  { type: 'EMAIL', icon: Mail, label: 'Email', placeholder: 'you@example.com' },
  { type: 'CALL', icon: Phone, label: 'Phone Call', placeholder: '+1234567890' },
]

export function ButtonEditor({ buttons, onChange }: ButtonEditorProps) {
  const addButton = () => {
    const newButton: LinkButton = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'URL',
      label: 'New Link',
      value: '',
      isActive: true
    }
    onChange([...buttons, newButton])
  }

  const updateButton = (id: string, updates: Partial<LinkButton>) => {
    onChange(buttons.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeButton = (id: string) => {
    onChange(buttons.filter(b => b.id !== id))
  }

  const moveButton = (index: number, direction: 'up' | 'down') => {
    const newButtons = [...buttons]
    if (direction === 'up' && index > 0) {
      [newButtons[index], newButtons[index - 1]] = [newButtons[index - 1], newButtons[index]]
    } else if (direction === 'down' && index < newButtons.length - 1) {
      [newButtons[index], newButtons[index + 1]] = [newButtons[index + 1], newButtons[index]]
    }
    onChange(newButtons)
  }

  return (
    <div className="space-y-6 p-6 bg-slate-900/50 border border-white/5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Buttons</h3>
        </div>
        <Button onClick={addButton} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Button
        </Button>
      </div>

      <div className="space-y-4">
        {buttons.length === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
            No buttons yet. Click "Add Button" to start.
          </div>
        )}

        <Accordion type="single" collapsible className="space-y-4">
          {buttons.map((button, index) => (
            <AccordionItem key={button.id} value={button.id} className="border border-white/10 rounded-lg bg-slate-950/50 px-4">
              <div className="flex items-center gap-3 py-4">
                <div className="flex flex-col gap-1 text-slate-500">
                  <button onClick={() => moveButton(index, 'up')} disabled={index === 0} className="hover:text-white disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveButton(index, 'down')} disabled={index === buttons.length - 1} className="hover:text-white disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <AccordionTrigger className="hover:no-underline py-0">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                        {React.createElement(BUTTON_TYPES.find(t => t.type === button.type)?.icon || Globe, { className: "w-4 h-4 text-slate-400" })}
                      </div>
                      <div>
                        <div className="font-medium text-white">{button.label}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[200px]">{button.value || "No URL set"}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeButton(button.id)}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <AccordionContent className="pb-4 pt-2 border-t border-white/5 space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={button.type}
                      onValueChange={(value) => updateButton(button.id, { type: value as ButtonType })}
                    >
                      <SelectTrigger className="bg-slate-900 border-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUTTON_TYPES.map(type => (
                          <SelectItem key={type.type} value={type.type}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={button.label}
                      onChange={(e) => updateButton(button.id, { label: e.target.value })}
                      className="bg-slate-900 border-slate-800"
                      placeholder="e.g. My Website"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Input
                      value={button.value}
                      onChange={(e) => updateButton(button.id, { value: e.target.value })}
                      className="bg-slate-900 border-slate-800"
                      placeholder={BUTTON_TYPES.find(t => t.type === button.type)?.placeholder || 'Enter value'}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
