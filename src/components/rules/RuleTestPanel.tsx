'use client'

import React, { useState } from 'react'
import { Play, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function RuleTestPanel() {
    const [testInput, setTestInput] = useState('')
    const [result, setResult] = useState<'success' | 'no_match' | null>(null)

    const runTest = () => {
        if (!testInput) return
        // Simulate matching logic
        if (testInput.toLowerCase().includes('price') || testInput.toLowerCase().includes('link')) {
            setResult('success')
        } else {
            setResult('no_match')
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/[0.08]">
                <h3 className="font-semibold text-white">Test Rule</h3>
                <p className="text-xs text-gray-400">Simulate a comment to see if it triggers.</p>
            </div>

            <div className="flex-1 p-4 space-y-6">
                <div className="space-y-2">
                    <Label className="text-xs text-gray-400">Mock Comment</Label>
                    <div className="flex gap-2">
                        <Input
                            value={testInput}
                            onChange={(e) => setTestInput(e.target.value)}
                            placeholder="Type a test comment..."
                            className="bg-white/[0.05] border-white/[0.12] text-white text-sm"
                        />
                        <Button size="icon" onClick={runTest} className="bg-white text-black hover:bg-gray-100 shrink-0">
                            <Play className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {result && (
                    <div className={`p-4 rounded-lg border ${result === 'success'
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-yellow-500/10 border-yellow-500/20'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            {result === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className={`text-sm font-medium ${result === 'success' ? 'text-green-400' : 'text-yellow-400'
                                }`}>
                                {result === 'success' ? 'Trigger Matched!' : 'No Match'}
                            </span>
                        </div>
                        {result === 'success' && (
                            <div className="text-xs text-gray-300">
                                <p className="mb-1">Action would execute:</p>
                                <div className="p-2 bg-black/40 rounded border border-white/10 italic">
                                    "Hey! Thanks for your comment..."
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
                <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white" onClick={() => {
                    setTestInput('')
                    setResult(null)
                }}>
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Reset Test
                </Button>
            </div>
        </div>
    )
}
