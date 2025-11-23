'use client'

import React from 'react'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const INVOICES = [
    { id: 'INV-001', date: 'Oct 23, 2023', amount: '₹220.00', status: 'Paid' },
    { id: 'INV-002', date: 'Sep 23, 2023', amount: '₹220.00', status: 'Paid' },
    { id: 'INV-003', date: 'Aug 23, 2023', amount: '₹220.00', status: 'Paid' },
]

export function InvoiceList() {
    return (
        <div className="rounded-lg border border-white/[0.08] overflow-hidden">
            <Table>
                <TableHeader className="bg-white/[0.03]">
                    <TableRow className="border-white/[0.08] hover:bg-transparent">
                        <TableHead className="text-gray-400">Invoice ID</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Amount</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-right text-gray-400">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {INVOICES.map((invoice) => (
                        <TableRow key={invoice.id} className="border-white/[0.08] hover:bg-white/[0.02]">
                            <TableCell className="font-medium text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                {invoice.id}
                            </TableCell>
                            <TableCell className="text-gray-400">{invoice.date}</TableCell>
                            <TableCell className="text-white">{invoice.amount}</TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    {invoice.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
