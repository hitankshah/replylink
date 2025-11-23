'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageEditorLayout } from '@/components/pages/PageEditorLayout'
import { ButtonListEditor } from '@/components/pages/ButtonListEditor'
import { ThemePicker } from '@/components/pages/ThemePicker'
import { TemplateGallery } from '@/components/pages/TemplateGallery'
import { PreviewFrame } from '@/components/pages/PreviewFrame'
import { PublishBar } from '@/components/pages/PublishBar'

export default function PageEditor() {
    const params = useParams()
    const pageId = params.id as string

    const [activeTab, setActiveTab] = useState('links')
    const [selectedTheme, setSelectedTheme] = useState('simple-dark')
    const [selectedTemplate, setSelectedTemplate] = useState('minimal')
    const [hasChanges, setHasChanges] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Mock data for preview
    const previewUrl = `https://replylink.to/${pageId}`

    const handleSave = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
        setHasChanges(false)
    }

    const handlePublish = () => {
        // Handle publish logic
        console.log('Publishing...')
    }

    const handleThemeChange = (theme: string) => {
        setSelectedTheme(theme)
        setHasChanges(true)
    }

    const handleTemplateChange = (template: string) => {
        setSelectedTemplate(template)
        setHasChanges(true)
    }

    return (
        <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white">
            <PageEditorLayout
                preview={
                    <PreviewFrame url={previewUrl} theme={selectedTheme}>
                        {/* This would be the actual rendered page content in the preview */}
                        <div className="p-4 text-center">
                            <h1 className="text-xl font-bold mb-2">My Page</h1>
                            <p className="text-sm opacity-80 mb-6">@username</p>
                            <div className="space-y-3">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">Link 1</div>
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">Link 2</div>
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">Link 3</div>
                            </div>
                        </div>
                    </PreviewFrame>
                }
            >
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Edit Page</h1>
                    <p className="text-gray-400">Customize your page content and appearance.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/[0.05] border border-white/[0.08]">
                        <TabsTrigger value="links" className="data-[state=active]:bg-white/[0.1] data-[state=active]:text-white">Links</TabsTrigger>
                        <TabsTrigger value="appearance" className="data-[state=active]:bg-white/[0.1] data-[state=active]:text-white">Appearance</TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-white/[0.1] data-[state=active]:text-white">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="links" className="mt-6 space-y-6">
                        <ButtonListEditor />
                    </TabsContent>

                    <TabsContent value="appearance" className="mt-6 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Templates</h3>
                            <TemplateGallery selectedTemplate={selectedTemplate} onSelectTemplate={handleTemplateChange} />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Theme</h3>
                            <ThemePicker selectedTheme={selectedTheme} onSelectTheme={handleThemeChange} />
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                        <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl text-center text-gray-400">
                            Settings panel coming soon...
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Spacer for bottom bar */}
                <div className="h-24"></div>
            </PageEditorLayout>

            <PublishBar
                isSaving={isSaving}
                hasChanges={hasChanges}
                onSave={handleSave}
                onPublish={handlePublish}
                pageUrl={previewUrl}
            />
        </div>
    )
}
