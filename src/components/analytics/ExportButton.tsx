'use client'

import React from 'react'
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ExportButton() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/[0.12] text-white hover:bg-white/[0.05]">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#111] border-white/[0.12] text-white min-w-[160px]">
                <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.12]" />
                <DropdownMenuItem className="focus:bg-white/[0.1] focus:text-white cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
                    CSV Export
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/[0.1] focus:text-white cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
                    Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/[0.1] focus:text-white cursor-pointer">
                    <FileText className="w-4 h-4 mr-2 text-red-400" />
                    PDF Report
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
