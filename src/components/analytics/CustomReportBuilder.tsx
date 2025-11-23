'use client'

import React, { useState } from 'react'
import { Plus, BarChart3, Calendar, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet'

const METRICS = [
    { id: 'views', label: 'Page Views' },
    { id: 'clicks', label: 'Button Clicks' },
    { id: 'ctr', label: 'Click-Through Rate' },
    { id: 'visitors', label: 'Unique Visitors' },
    { id: 'bounce', label: 'Bounce Rate' },
    { id: 'duration', label: 'Avg. Duration' },
]

const DIMENSIONS = [
    { id: 'date', label: 'Date' },
    { id: 'country', label: 'Country' },
    { id: 'device', label: 'Device Type' },
    { id: 'browser', label: 'Browser' },
    { id: 'referrer', label: 'Referrer Source' },
]

export function CustomReportBuilder() {
    const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['views', 'clicks'])
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['date'])

    const toggleMetric = (id: string) => {
        setSelectedMetrics(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const toggleDimension = (id: string) => {
        setSelectedDimensions(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        )
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="border-white/[0.12] text-white hover:bg-white/[0.05]">
                    <Plus className="w-4 h-4 mr-2" />
                    Custom Report
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#111] border-l border-white/[0.12] text-white w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle className="text-white">Build Custom Report</SheetTitle>
                    <SheetDescription className="text-gray-400">
                        Select metrics and dimensions to create a tailored analytics report.
                    </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-8">
                    {/* Metrics Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-400">
                            <BarChart3 className="w-5 h-5" />
                            <h3 className="font-medium">Metrics</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {METRICS.map((metric) => (
                                <div key={metric.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`metric-${metric.id}`}
                                        checked={selectedMetrics.includes(metric.id)}
                                        onCheckedChange={() => toggleMetric(metric.id)}
                                        className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                    <Label htmlFor={`metric-${metric.id}`} className="text-sm font-normal text-gray-300 cursor-pointer">
                                        {metric.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dimensions Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-400">
                            <Filter className="w-5 h-5" />
                            <h3 className="font-medium">Dimensions (Group By)</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {DIMENSIONS.map((dim) => (
                                <div key={dim.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`dim-${dim.id}`}
                                        checked={selectedDimensions.includes(dim.id)}
                                        onCheckedChange={() => toggleDimension(dim.id)}
                                        className="border-white/20 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                    />
                                    <Label htmlFor={`dim-${dim.id}`} className="text-sm font-normal text-gray-300 cursor-pointer">
                                        {dim.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <SheetFooter>
                    <Button className="w-full bg-white text-black hover:bg-gray-100">
                        Generate Report
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
