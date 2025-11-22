'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Filter } from 'lucide-react'

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
        return '📷'
      case 'FACEBOOK':
        return '👥'
      case 'WHATSAPP':
        return '💬'
      default:
        return '🔗'
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
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Auto-Reply Rules</h1>
            <p className="text-slate-400">
              Manage your auto-reply rules across all connected platforms
            </p>
          </div>
          <Link
            href="/dashboard/rules/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            Create Rule
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-400">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Platforms</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="WHATSAPP">WhatsApp</option>
            </select>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="bg-slate-700 text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Rules Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400 mb-4">No rules found</p>
              <Link
                href="/dashboard/rules/create"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Create your first rule →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700 border-b border-slate-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Trigger
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Executions
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule) => (
                    <tr
                      key={rule.id}
                      className="border-b border-slate-700 hover:bg-slate-750 transition"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {rule.name}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{getPlatformIcon(rule.platform)}</span>
                          <span className="text-slate-300">{rule.platform}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {getTriggerLabel(rule.triggerType)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs font-medium">
                          {rule.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {rule.executionCount}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            rule.isActive
                              ? 'bg-green-900/50 text-green-200'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleToggle(rule.id, rule.isActive)}
                            className="text-slate-400 hover:text-slate-300 transition"
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
                            className="text-blue-400 hover:text-blue-300 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(rule.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                className={`px-3 py-1 rounded text-sm ${
                  pagination.page === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
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
