'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Filter, Search, Instagram, Facebook, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Rule {
  id: string
  name: string
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP'
  accountName: string
  triggerType: string
  isActive: boolean
  priority: number
  executionCount: number
  createdAt: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

export default function RulesListPage() {
  const router = useRouter()
  const [rules, setRules] = useState<Rule[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [platform, setPlatform] = useState<string>('')
  const [isActive, setIsActive] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const fetchRules = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      if (platform) params.append('platform', platform)
      if (isActive) params.append('isActive', isActive)
      if (search) params.append('search', search)

      const res = await fetch(`/api/rules?${params}`)
      if (!res.ok) throw new Error('Failed to fetch rules')

      const data = await res.json()
      setRules(data.data)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching rules')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules(pagination.page)
  }, [platform, isActive, search])

  const handleDelete = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return

    try {
      const res = await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete rule')
      await fetchRules(pagination.page)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting rule')
    }
  }

  const handleToggle = async (ruleId: string, currentState: boolean) => {
    try {
      const res = await fetch(`/api/rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      })
      if (!res.ok) throw new Error('Failed to toggle rule')
      await fetchRules(pagination.page)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error toggling rule')
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'INSTAGRAM':
        return <Instagram className="w-4 h-4 text-pink-500" />
      case 'FACEBOOK':
        return <Facebook className="w-4 h-4 text-blue-500" />
      case 'WHATSAPP':
        return <MessageCircle className="w-4 h-4 text-green-500" />
      default:
        return <div className="w-4 h-4 bg-gray-600 rounded-full" />
    }
  }

  const getTriggerLabel = (trigger: string) => {
    const labels: Record<string, string> = {
      COMMENT: 'Comment',
      MESSAGE: 'Direct Message',
      MENTION: 'Mention',
      KEYWORD: 'Keyword',
      TIME: 'Scheduled Time',
    }
    return labels[trigger] || trigger
  }

  return (
    <div className="min-h-screen bg-[hsl(0,0%,4%)] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Auto-Reply Rules</h1>
            <p className="text-gray-400">
              Manage your auto-reply rules across all connected platforms
            </p>
          </div>
          <Link href="/dashboard/rules/create">
            <Button className="bg-white text-black hover:bg-gray-100 gap-2 font-medium">
              <Plus className="w-4 h-4" />
              Create Rule
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/[0.05] border-white/[0.12] text-white placeholder:text-gray-500 focus:border-white/[0.24] focus:ring-0"
              />
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-white/[0.05] border border-white/[0.12] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/[0.24]"
            >
              <option value="">All Platforms</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="bg-white/[0.05] border border-white/[0.12] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/[0.24]"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Rules Table */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">No rules found</p>
              <Link
                href="/dashboard/rules/create"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Create your first rule →
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-white/[0.02] border-b border-white/[0.08]">
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="text-gray-400 font-medium">Name</TableHead>
                  <TableHead className="text-gray-400 font-medium">Platform</TableHead>
                  <TableHead className="text-gray-400 font-medium">Trigger</TableHead>
                  <TableHead className="text-gray-400 font-medium">Priority</TableHead>
                  <TableHead className="text-gray-400 font-medium">Executions</TableHead>
                  <TableHead className="text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-center text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow
                    key={rule.id}
                    className="border-white/[0.08] hover:bg-white/[0.04] transition-colors"
                  >
                    <TableCell className="font-medium text-white">
                      {rule.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(rule.platform)}
                        <span className="text-gray-300 text-sm capitalize">{rule.platform.toLowerCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {getTriggerLabel(rule.triggerType)}
                    </TableCell>
                    <TableCell>
                      <span className="bg-white/[0.05] border border-white/[0.1] text-gray-300 px-2 py-0.5 rounded text-xs font-medium">
                        {rule.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {rule.executionCount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${rule.isActive
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggle(rule.id, rule.isActive)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.1] rounded-md transition-colors"
                          title={rule.isActive ? 'Disable' : 'Enable'}
                        >
                          {rule.isActive ? (
                            <ToggleRight size={18} />
                          ) : (
                            <ToggleLeft size={18} />
                          )}
                        </button>
                        <Link
                          href={`/dashboard/rules/${rule.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/[0.1] rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => {
                  setPagination({ ...pagination, page })
                  fetchRules(page)
                }}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${pagination.page === page
                    ? 'bg-white text-black font-medium'
                    : 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.1] hover:text-white'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
