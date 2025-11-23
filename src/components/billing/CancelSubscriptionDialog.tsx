'use client'

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

export function CancelSubscriptionDialog() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                    Cancel Subscription
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#111] border-white/[0.12] text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        This action cannot be undone. This will immediately cancel your subscription and you will lose access to premium features at the end of your billing period.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent border-white/[0.12] text-white hover:bg-white/[0.05]">
                        Keep Subscription
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                        Yes, Cancel
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
