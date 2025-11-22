'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Workspace {
  id: string
  name: string
  description?: string
  logo?: string
  plan: string
  memberCount: number
  role: string
  isActive: boolean
  createdAt: string
}

export default function WorkspacesPage() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/workspaces')
      if (!res.ok) throw new Error('Failed to fetch workspaces')
      const data = await res.json()
      setWorkspaces(data.workspaces || [])
      setCurrentWorkspaceId(data.currentWorkspaceId || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspaces')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = () => {
    router.push('/dashboard/workspaces/create')
  }

  const handleSelectWorkspace = async (workspaceId: string) => {
    try {
      const res = await fetch('/api/workspaces/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      })
      if (!res.ok) throw new Error('Failed to select workspace')
      router.push(`/dashboard/workspaces/${workspaceId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select workspace')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading workspaces...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Workspaces</h1>
            <Button
              onClick={handleCreateWorkspace}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Workspace
            </Button>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your workspaces and team members
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {workspaces.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                No workspaces yet. Create your first workspace to get started.
              </p>
              <Button
                onClick={handleCreateWorkspace}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Your First Workspace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  currentWorkspaceId === workspace.id
                    ? 'ring-2 ring-blue-500 border-blue-500'
                    : ''
                }`}
                onClick={() => handleSelectWorkspace(workspace.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{workspace.name}</CardTitle>
                      {workspace.description && (
                        <CardDescription className="line-clamp-2">
                          {workspace.description}
                        </CardDescription>
                      )}
                    </div>
                    {currentWorkspaceId === workspace.id && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-900 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Plan:</span>
                      <span className="font-semibold capitalize">
                        {workspace.plan || 'Free'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Members:</span>
                      <span className="font-semibold">{workspace.memberCount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Role:</span>
                      <span className="font-semibold capitalize">{workspace.role}</span>
                    </div>
                    <div className="pt-3 flex gap-2">
                      <Link
                        href={`/dashboard/workspaces/${workspace.id}/settings`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Settings
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
