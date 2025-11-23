'use client'

import React from 'react'
import { CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

const LOGS = [
    { id: 1, rule: 'Price Inquiry', platform: 'Instagram', trigger: 'Comment: "price?"', action: 'Sent DM', status: 'success', time: '2 mins ago' },
    { id: 2, rule: 'Welcome Msg', platform: 'Facebook', trigger: 'New Follower', action: 'Sent DM', status: 'success', time: '15 mins ago' },
    { id: 3, rule: 'Support', platform: 'WhatsApp', trigger: 'Message: "help"', action: 'Failed', status: 'failed', time: '1 hour ago' },
    { id: 4, rule: 'Price Inquiry', platform: 'Instagram', trigger: 'Comment: "cost"', action: 'Sent DM', status: 'success', time: '2 hours ago' },
    { id: 5, rule: 'Giveaway', platform: 'Instagram', trigger: 'Comment: "enter"', action: 'Sent DM', status: 'success', time: '3 hours ago' },
]

export default function ExecutionLogsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen bg-[hsl(0,0%,4%)] text-white">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Execution Logs</h1>
                    <p className="text-gray-400">View the history of all automated actions performed by your rules.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/[0.12] text-white hover:bg-white/[0.05]">
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search logs..."
                        className="pl-9 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-600"
                    />
                </div>
                <Button variant="outline" className="border-white/[0.12] text-white hover:bg-white/[0.05]">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                </Button>
            </div>

            {/* Logs Table */}
            <div className="rounded-lg border border-white/[0.08] overflow-hidden">
                <Table>
                    <TableHeader className="bg-white/[0.03]">
                        <TableRow className="border-white/[0.08] hover:bg-transparent">
                            <TableHead className="text-gray-400">Status</TableHead>
                            <TableHead className="text-gray-400">Rule Name</TableHead>
                            <TableHead className="text-gray-400">Platform</TableHead>
                            <TableHead className="text-gray-400">Trigger Event</TableHead>
                            <TableHead className="text-gray-400">Action Taken</TableHead>
                            <TableHead className="text-gray-400">Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {LOGS.map((log) => (
                            <TableRow key={log.id} className="border-white/[0.08] hover:bg-white/[0.02]">
                                <TableCell>
                                    {log.status === 'success' ? (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-xs font-medium">Success</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-400">
                                            <XCircle className="w-4 h-4" />
                                            <span className="text-xs font-medium">Failed</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium text-white">{log.rule}</TableCell>
                                <TableCell className="text-gray-400">{log.platform}</TableCell>
                                <TableCell className="text-gray-300 font-mono text-xs">{log.trigger}</TableCell>
                                <TableCell className="text-gray-300">{log.action}</TableCell>
                                <TableCell className="text-gray-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {log.time}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
