'use client'

import React, { useState } from 'react'
import {
  QrCode, Scissors, MessageCircle, BarChart3, Share2, Palette,
  Users2, GitBranch, Globe, CreditCard, Lock, Zap,
  Code2, Copy, Check, AlertCircle, Server
} from 'lucide-react'

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  params?: string
  body?: string
  response?: string
  auth: boolean
  category: string
}

const ENDPOINTS: Endpoint[] = [
  // QR Code
  {
    method: 'GET',
    path: '/api/qr-code/[pageId]',
    description: 'Get public QR code for a page',
    params: 'format=png|dataurl|svg, size=200-500, color=#RRGGBB',
    response: '{ qrCode: string, format: string, size: number }',
    auth: false,
    category: 'QR Code'
  },
  {
    method: 'POST',
    path: '/api/qr-code',
    description: 'Generate custom QR code',
    body: '{ pageId, format, size, color, backgroundColor }',
    response: '{ qrCode, format, size, cached: boolean }',
    auth: true,
    category: 'QR Code'
  },

  // Short Links
  {
    method: 'POST',
    path: '/api/short-links',
    description: 'Create a short link',
    body: '{ targetUrl, customSlug?, pageId?, buttonId? }',
    response: '{ slug, shortUrl, targetUrl, clicks: 0 }',
    auth: true,
    category: 'Short Links'
  },
  {
    method: 'GET',
    path: '/api/short-links',
    description: 'List short links for a page',
    params: 'pageId, limit=10, offset=0',
    response: '{ links: [], total, hasMore }',
    auth: true,
    category: 'Short Links'
  },
  {
    method: 'GET',
    path: '/api/short-links/[slug]',
    description: 'Redirect to target URL',
    response: '302 Redirect to targetUrl',
    auth: false,
    category: 'Short Links'
  },
  {
    method: 'DELETE',
    path: '/api/short-links/[slug]',
    description: 'Delete a short link',
    response: '{ success, message }',
    auth: true,
    category: 'Short Links'
  },

  // Analytics
  {
    method: 'GET',
    path: '/api/analytics/page/[pageId]',
    description: 'Get page analytics',
    params: 'format=json|csv, devices=true, referrers=true, days=7',
    response: '{ views, clicks, ctr, topButtons, deviceBreakdown, referrers }',
    auth: true,
    category: 'Analytics'
  },
  {
    method: 'GET',
    path: '/api/analytics/workspace',
    description: 'Get workspace analytics',
    params: 'days=7',
    response: '{ totalViews, totalClicks, topPages, platformStats }',
    auth: true,
    category: 'Analytics'
  },

  // Rules
  {
    method: 'POST',
    path: '/api/rules',
    description: 'Create an auto-reply rule',
    body: '{ platform, triggerType, keywords, message, priority }',
    response: '{ id, platform, triggerType, status: "active", executions: 0 }',
    auth: true,
    category: 'Rules'
  },
  {
    method: 'GET',
    path: '/api/rules',
    description: 'List all rules',
    params: 'platform, status, limit=10, offset=0',
    response: '{ rules: [], total, hasMore }',
    auth: true,
    category: 'Rules'
  },
  {
    method: 'PUT',
    path: '/api/rules/[id]',
    description: 'Update a rule',
    body: '{ platform, triggerType, keywords, message, priority, status }',
    response: '{ id, ...updated_fields }',
    auth: true,
    category: 'Rules'
  },
  {
    method: 'DELETE',
    path: '/api/rules/[id]',
    description: 'Delete a rule',
    response: '{ success, message }',
    auth: true,
    category: 'Rules'
  },

  // Social Media
  {
    method: 'POST',
    path: '/api/auth/social/connect',
    description: 'Initiate OAuth flow for social platform',
    body: '{ platform: "instagram"|"facebook"|"whatsapp"|"twitter"|"tiktok"|"linkedin" }',
    response: '{ authUrl: string, state: string }',
    auth: true,
    category: 'Social Media'
  },
  {
    method: 'GET',
    path: '/api/auth/social/callback',
    description: 'Handle OAuth callback',
    params: 'code, state',
    response: '{ success, platform, account }',
    auth: false,
    category: 'Social Media'
  },
  {
    method: 'GET',
    path: '/api/auth/social/accounts',
    description: 'Get connected social accounts',
    response: '{ accounts: [{ platform, username, connected, status }] }',
    auth: true,
    category: 'Social Media'
  },
  {
    method: 'DELETE',
    path: '/api/auth/social/disconnect',
    description: 'Disconnect a social account',
    body: '{ platform }',
    response: '{ success, disconnected: true }',
    auth: true,
    category: 'Social Media'
  },

  // Pages
  {
    method: 'POST',
    path: '/api/pages',
    description: 'Create a new link page',
    body: '{ title, bio, username, avatar, theme }',
    response: '{ id, title, username, status: "active" }',
    auth: true,
    category: 'Pages'
  },
  {
    method: 'GET',
    path: '/api/pages',
    description: 'Get user\'s link pages',
    params: 'limit=10, offset=0',
    response: '{ pages: [], total, hasMore }',
    auth: true,
    category: 'Pages'
  },
  {
    method: 'PUT',
    path: '/api/pages/[id]',
    description: 'Update a page',
    body: '{ title, bio, avatar, theme, buttons }',
    response: '{ id, ...updated_fields }',
    auth: true,
    category: 'Pages'
  },
  {
    method: 'DELETE',
    path: '/api/pages/[id]',
    description: 'Delete a page',
    response: '{ success, deleted: true }',
    auth: true,
    category: 'Pages'
  },

  // Branding
  {
    method: 'GET',
    path: '/api/branding/[pageId]',
    description: 'Get page branding configuration',
    params: 'includeTemplates=true',
    response: '{ theme, templates, css, customCSS }',
    auth: true,
    category: 'Branding'
  },
  {
    method: 'PUT',
    path: '/api/branding/[pageId]',
    description: 'Update page branding',
    body: '{ primaryColor, secondaryColor, backgroundColor, customCSS }',
    response: '{ theme, css }',
    auth: true,
    category: 'Branding'
  },

  // Collaborators
  {
    method: 'POST',
    path: '/api/collaborators',
    description: 'Add a collaborator to page',
    body: '{ pageId, email, role: "OWNER"|"EDITOR"|"VIEWER" }',
    response: '{ id, email, role, status: "invited" }',
    auth: true,
    category: 'Collaboration'
  },
  {
    method: 'GET',
    path: '/api/collaborators',
    description: 'List page collaborators',
    params: 'pageId',
    response: '{ collaborators: [] }',
    auth: true,
    category: 'Collaboration'
  },
  {
    method: 'PUT',
    path: '/api/collaborators',
    description: 'Update collaborator role',
    body: '{ pageId, collaboratorId, role }',
    response: '{ id, role, updated: true }',
    auth: true,
    category: 'Collaboration'
  },
  {
    method: 'DELETE',
    path: '/api/collaborators',
    description: 'Remove collaborator',
    body: '{ pageId, collaboratorId }',
    response: '{ success, removed: true }',
    auth: true,
    category: 'Collaboration'
  },

  // Billing
  {
    method: 'POST',
    path: '/api/billing/create-subscription',
    description: 'Create a subscription',
    body: '{ planType: "starter"|"pro"|"agency", gateway: "razorpay"|"paypal" }',
    response: '{ paymentUrl, subscriptionId, planType }',
    auth: true,
    category: 'Billing'
  },
  {
    method: 'GET',
    path: '/api/billing/info',
    description: 'Get current plan and usage',
    response: '{ currentPlan, usage, paymentHistory }',
    auth: true,
    category: 'Billing'
  },

  // Webhooks
  {
    method: 'POST',
    path: '/api/webhooks/instagram',
    description: 'Instagram webhook endpoint',
    body: 'Platform-specific payload',
    response: '{ status: "received" }',
    auth: false,
    category: 'Webhooks'
  },
  {
    method: 'POST',
    path: '/api/webhooks/facebook',
    description: 'Facebook webhook endpoint',
    body: 'Platform-specific payload',
    response: '{ status: "received" }',
    auth: false,
    category: 'Webhooks'
  },
  {
    method: 'POST',
    path: '/api/webhooks/whatsapp',
    description: 'WhatsApp webhook endpoint',
    body: 'Platform-specific payload',
    response: '{ status: "received" }',
    auth: false,
    category: 'Webhooks'
  }
]

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    POST: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    PUT: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    DELETE: 'bg-red-500/20 text-red-300 border-red-500/30',
    PATCH: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  }
  
  return (
    <span className={`px-3 py-1 rounded-lg border font-mono font-bold text-sm ${colors[method]}`}>
      {method}
    </span>
  )
}

export default function FeatureAPIPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [copied, setCopied] = useState<string | null>(null)

  const categories = ['All', ...new Set(ENDPOINTS.map(e => e.category))]
  const filtered = selectedCategory === 'All' 
    ? ENDPOINTS 
    : ENDPOINTS.filter(e => e.category === selectedCategory)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Feature APIs</h1>
          </div>
          <p className="text-slate-400">
            Complete API reference for all ReplyLink features. All endpoints require authentication unless marked otherwise.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 border border-white/5 hover:border-emerald-500/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {filtered.map((endpoint, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
            >
              <div className="p-6">
                {/* Endpoint Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <MethodBadge method={endpoint.method} />
                    <div>
                      <p className="font-mono text-white font-bold">{endpoint.path}</p>
                      <p className="text-slate-400 text-sm mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {endpoint.auth && (
                      <div className="flex items-center gap-1 bg-blue-500/10 text-blue-300 px-2 py-1 rounded-lg text-xs">
                        <Lock className="w-3 h-3" /> Auth
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {endpoint.params && (
                    <div>
                      <p className="text-slate-400 font-semibold mb-2">Parameters:</p>
                      <div className="bg-slate-800/50 border border-white/5 rounded p-3 font-mono text-slate-300">
                        {endpoint.params}
                      </div>
                    </div>
                  )}

                  {endpoint.body && (
                    <div>
                      <p className="text-slate-400 font-semibold mb-2">Request Body:</p>
                      <div className="bg-slate-800/50 border border-white/5 rounded p-3 font-mono text-slate-300">
                        {endpoint.body}
                      </div>
                    </div>
                  )}

                  {endpoint.response && (
                    <div className="md:col-span-2">
                      <p className="text-slate-400 font-semibold mb-2">Response:</p>
                      <div className="flex items-start gap-2">
                        <div className="bg-slate-800/50 border border-white/5 rounded p-3 font-mono text-slate-300 flex-1 overflow-x-auto">
                          {endpoint.response}
                        </div>
                        <button
                          onClick={() => handleCopy(endpoint.response || '')}
                          className="flex-shrink-0 p-2 hover:bg-slate-800 rounded transition-colors"
                        >
                          {copied === endpoint.response ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-2">API Documentation</h3>
            <p className="text-blue-300 text-sm mb-3">
              All endpoints require a valid JWT token in the Authorization header: <br/>
              <code className="bg-slate-900 px-2 py-1 rounded mt-2 block font-mono">
                Authorization: Bearer YOUR_JWT_TOKEN
              </code>
            </p>
            <p className="text-blue-300 text-sm">
              Base URL: <code className="bg-slate-900 px-2 py-1 rounded font-mono">https://api.replylink.io/api</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
