"use client"

import React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, Layout } from "lucide-react"

interface Theme {
  mode: 'light' | 'dark'
  primaryColor: string
  backgroundColor: string
  fontFamily: string
  buttonStyle: 'rounded' | 'square' | 'pill'
}

interface ThemeCustomizerProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

export function ThemeCustomizer({ theme, onChange }: ThemeCustomizerProps) {
  const handleChange = (key: keyof Theme, value: any): void => {
    onChange({ ...theme, [key]: value })
  }

  return (
    <div className="space-y-6 p-6 bg-slate-900/50 border border-white/5 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Theme & Appearance</h3>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background</Label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded border border-white/10 overflow-hidden">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-[150%] h-[150%] -m-[25%] cursor-pointer"
                  />
                </div>
                <Input
                  value={theme.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded border border-white/10 overflow-hidden">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-[150%] h-[150%] -m-[25%] cursor-pointer"
                  />
                </div>
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Presets</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { bg: '#0f172a', primary: '#6366f1', name: 'Midnight' },
                { bg: '#ffffff', primary: '#000000', name: 'Clean' },
                { bg: '#18181b', primary: '#22c55e', name: 'Forest' },
                { bg: '#4c0519', primary: '#fb7185', name: 'Rose' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onChange({ ...theme, backgroundColor: preset.bg, primaryColor: preset.primary })}
                  className="h-12 rounded-lg border border-white/10 hover:scale-105 transition-transform"
                  style={{ backgroundColor: preset.bg }}
                  title={preset.name}
                >
                  <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: preset.primary }} />
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-md h-10 px-3 text-sm"
              value={theme.fontFamily}
              onChange={(e) => handleChange('fontFamily', e.target.value)}
            >
              <option value="Inter">Inter (Modern)</option>
              <option value="Roboto">Roboto (Standard)</option>
              <option value="Playfair Display">Playfair (Serif)</option>
              <option value="Courier Prime">Courier (Mono)</option>
            </select>
          </div>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Button Style</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme.buttonStyle === 'rounded' ? 'default' : 'outline'}
                onClick={() => handleChange('buttonStyle', 'rounded')}
                className="rounded-md"
              >
                Rounded
              </Button>
              <Button
                variant={theme.buttonStyle === 'pill' ? 'default' : 'outline'}
                onClick={() => handleChange('buttonStyle', 'pill')}
                className="rounded-full"
              >
                Pill
              </Button>
              <Button
                variant={theme.buttonStyle === 'square' ? 'default' : 'outline'}
                onClick={() => handleChange('buttonStyle', 'square')}
                className="rounded-none"
              >
                Square
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
