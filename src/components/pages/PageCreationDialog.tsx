'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

const createPageSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, dashes, and underscores allowed'),
    title: z.string().min(1, 'Title is required'),
})

type CreatePageFormData = z.infer<typeof createPageSchema>

export function PageCreationDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CreatePageFormData>({
        resolver: zodResolver(createPageSchema),
    })

    const onSubmit = async (data: CreatePageFormData) => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to create page')
            }

            const newPage = await response.json()
            setOpen(false)
            reset()
            router.push(`/dashboard/pages/${newPage.id}/editor`)
        } catch (error) {
            console.error('Error creating page:', error)
            // In a real app, show toast error here
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-black hover:bg-gray-100 gap-2 font-medium">
                    <Plus className="w-4 h-4" />
                    Create New Page
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#111] border-white/[0.12] text-white">
                <DialogHeader>
                    <DialogTitle>Create your Link Page</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Choose a unique username and title for your new page.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-300">Username</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                replylink.to/
                            </span>
                            <Input
                                id="username"
                                placeholder="username"
                                className="pl-24 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-600 focus:border-white/[0.24]"
                                {...register('username')}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-400 text-sm">{errors.username.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-300">Page Title</Label>
                        <Input
                            id="title"
                            placeholder="My Awesome Links"
                            className="bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-600 focus:border-white/[0.24]"
                            {...register('title')}
                        />
                        {errors.title && (
                            <p className="text-red-400 text-sm">{errors.title.message}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Page'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
