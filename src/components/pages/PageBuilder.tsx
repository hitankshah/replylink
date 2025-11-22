"use client"

import React, { useState } from "react"
import { Save, Eye, ArrowLeft, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeCustomizer } from "./ThemeCustomizer"
import { ButtonEditor, LinkButton } from "./ButtonEditor"
import Link from "next/link"

interface PageBuilderProps {
  pageId?: string
  initialUsername?: string
  initialTitle?: string
  initialBio?: string
  initialTheme?: any
  initialButtons?: LinkButton[]
  onSave: (data: any) => Promise<void>
  isLoading?: boolean
}

export function PageBuilder({
  pageId,
  initialUsername,
  initialTitle,
  initialBio,
  initialTheme,
  initialButtons,
  onSave,
  isLoading = false
}: PageBuilderProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  // State
  const [pageData, setPageData] = useState({
    username: initialUsername || "",
    title: initialTitle || "My Link Page",
    bio: initialBio || "",
    avatar: "",
    theme: initialTheme || {
      mode: 'dark',
      primaryColor: '#6366f1',
      backgroundColor: '#0f172a',
      fontFamily: 'Inter',
      buttonStyle: 'rounded'
    },
    buttons: initialButtons || ([] as LinkButton[])
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(pageData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-950">

      {/* LEFT: Editor Panel */}
      <div className="flex-1 flex flex-col border-r border-white/5 min-w-0">
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/pages">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-bold text-white truncate">Editing: @{pageData.username || "new_page"}</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 max-w-2xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-8">
                {/* Profile Section */}
                <div className="space-y-6 p-6 bg-slate-900/50 border border-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold text-white">Profile</h3>

                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-indigo-500 transition-colors">
                      {pageData.avatar ? (
                        <img src={pageData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-indigo-400" />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label>Page Title</Label>
                        <Input
                          value={pageData.title}
                          onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                          className="bg-slate-900 border-slate-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={pageData.bio}
                          onChange={(e) => setPageData({ ...pageData, bio: e.target.value })}
                          className="bg-slate-900 border-slate-800 h-20 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons Section */}
                <ButtonEditor
                  buttons={pageData.buttons}
                  onChange={(buttons) => setPageData({ ...pageData, buttons })}
                />
              </TabsContent>

              <TabsContent value="design">
                <ThemeCustomizer
                  theme={pageData.theme}
                  onChange={(theme) => setPageData({ ...pageData, theme })}
                />
              </TabsContent>

              <TabsContent value="settings">
                <div className="p-6 bg-slate-900/50 border border-white/5 rounded-xl text-center text-slate-500">
                  Advanced settings (SEO, Analytics, Custom Domain) coming soon.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* RIGHT: Preview Panel */}
      <div className="hidden lg:flex w-[450px] bg-slate-950 border-l border-white/5 flex-col items-center justify-center p-8 relative">
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-2 border-white/10 text-slate-400">
            <Eye className="w-3 h-3" /> Live Preview
          </Button>
        </div>

        {/* Phone Frame */}
        <div className="w-[320px] h-[640px] rounded-[3rem] border-[8px] border-slate-900 bg-black shadow-2xl overflow-hidden relative ring-1 ring-white/10">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-xl z-20" />

          {/* Screen Content */}
          <div
            className="w-full h-full overflow-y-auto custom-scrollbar pb-8"
            style={{
              backgroundColor: pageData.theme.backgroundColor,
              color: pageData.theme.mode === 'light' ? '#000' : '#fff',
              fontFamily: pageData.theme.fontFamily
            }}
          >
            <div className="pt-16 px-6 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-slate-800 mb-4 overflow-hidden border-2 border-white/10">
                {pageData.avatar ? (
                  <img src={pageData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-700 animate-pulse" />
                )}
              </div>

              {/* Title & Bio */}
              <h2 className="text-xl font-bold mb-2">{pageData.title}</h2>
              <p className="text-sm opacity-80 mb-8 leading-relaxed">{pageData.bio}</p>

              {/* Buttons */}
              <div className="w-full space-y-3">
                {pageData.buttons.map((btn: LinkButton) => (
                  <a
                    key={btn.id}
                    href={btn.value || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 px-4 text-center font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] ${pageData.theme.buttonStyle === 'pill' ? 'rounded-full' :
                        pageData.theme.buttonStyle === 'rounded' ? 'rounded-lg' : 'rounded-none'
                      }`}
                    style={{
                      backgroundColor: pageData.theme.primaryColor,
                      color: '#fff', // Assuming primary color is always dark enough or we need contrast logic
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold opacity-50 uppercase tracking-widest">
                <div className="w-3 h-3 bg-current rounded-sm" />
                ReplyLink
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
