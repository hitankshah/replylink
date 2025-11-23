'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Building2, Users, CheckCircle2, Settings } from 'lucide-react'

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
      <div className="flex items-center justify-center min-h-screen bg-[hsl(0,0%,4%)] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workspaces...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Workspaces</h1>
            <p className="text-gray-400">
              Manage your workspaces and team members
            </p>
          </div>
          <Button
            onClick={handleCreateWorkspace}
            className="bg-white text-black hover:bg-gray-100 gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Workspace
          </Button>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {workspaces.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No workspaces yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first workspace to start managing your links and team members.
            </p>
            <Button
              onClick={handleCreateWorkspace}
              className="bg-white text-black hover:bg-gray-100 font-medium"
            >
              Create Your First Workspace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className={`group cursor-pointer transition-all rounded-lg border p-6 ${currentWorkspaceId === workspace.id
                    ? 'bg-white/[0.05] border-blue-500/50 ring-1 ring-blue-500/20'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.05]'
                  }`}
                onClick={() => handleSelectWorkspace(workspace.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{workspace.name}</h3>
                    {workspace.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {workspace.description}
                      </p>
                    )}
                  </div>
                  {currentWorkspaceId === workspace.id && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-2 border-t border-white/[0.08]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Plan</span>
                    <span className="font-medium text-white capitalize">
                      {workspace.plan || 'Free'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Members</span>
                    <div className="flex items-center gap-1.5 text-white">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      <span className="font-medium">{workspace.memberCount}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Role</span>
                    <span className="font-medium text-white capitalize">{workspace.role}</span>
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/dashboard/workspaces/${workspace.id}/settings`}
                      className="block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="outline" size="sm" className="w-full bg-transparent border-white/[0.12] text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.2]">
                        <Settings className="w-3.5 h-3.5 mr-2" />
                        Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
