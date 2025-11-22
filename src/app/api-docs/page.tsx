import React from 'react'

interface APIEndpoint {
  phase: number
  category: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  description: string
  params?: string[]
  body?: string
  response: string
  auth: boolean
}

const API_ENDPOINTS: APIEndpoint[] = [
  // Auth
  {
    phase: 1,
    category: 'Authentication',
    method: 'POST',
    endpoint: '/api/auth/login',
    description: 'Login with email and password',
    body: '{ email, password }',
    response: '{ sessionToken, user }',
    auth: false,
  },
  {
    phase: 1,
    category: 'Authentication',
    method: 'POST',
    endpoint: '/api/auth/signup',
    description: 'Create new account',
    body: '{ email, password, name }',
    response: '{ sessionToken, user, subscription }',
    auth: false,
  },

  // Pages
  {
    phase: 2,
    category: 'Link Pages',
    method: 'GET',
    endpoint: '/api/pages',
    description: 'List user pages',
    response: '{ pages: [], total }',
    auth: true,
  },
  {
    phase: 2,
    category: 'Link Pages',
    method: 'POST',
    endpoint: '/api/pages',
    description: 'Create new page',
    body: '{ title, description }',
    response: '{ id, title, slug }',
    auth: true,
  },

  // Buttons
  {
    phase: 2,
    category: 'Link Pages',
    method: 'POST',
    endpoint: '/api/buttons',
    description: 'Add button to page',
    body: '{ pageId, label, url }',
    response: '{ id, label, url }',
    auth: true,
  },

  // Analytics
  {
    phase: 3,
    category: 'Analytics',
    method: 'GET',
    endpoint: '/api/analytics/page/[pageId]',
    description: 'Get page analytics',
    params: ['pageId', 'format?', 'devices?', 'referrers?'],
    response: '{ totalViews, totalClicks, ctr, buttons }',
    auth: true,
  },

  // QR Code
  {
    phase: 7,
    category: 'Linktree Features',
    method: 'GET',
    endpoint: '/api/qr-code/[pageId]',
    description: 'Generate QR code for page',
    params: ['pageId', 'format?'],
    response: 'PNG image or { qrCode, url }',
    auth: false,
  },

  // Short Links
  {
    phase: 7,
    category: 'Linktree Features',
    method: 'POST',
    endpoint: '/api/short-links',
    description: 'Create short link',
    body: '{ pageId, buttonId?, customSlug? }',
    response: '{ shortUrl, slug, targetUrl }',
    auth: true,
  },
  {
    phase: 7,
    category: 'Linktree Features',
    method: 'GET',
    endpoint: '/api/short-links/[slug]',
    description: 'Redirect to target URL',
    params: ['slug'],
    response: '302 redirect',
    auth: false,
  },

  // Social
  {
    phase: 7,
    category: 'Social Integration',
    method: 'POST',
    endpoint: '/api/auth/social/connect',
    description: 'Get OAuth authorization URL',
    body: '{ platform }',
    response: '{ authUrl }',
    auth: true,
  },

  // Domains
  {
    phase: 7,
    category: 'Customization',
    method: 'POST',
    endpoint: '/api/domains',
    description: 'Add custom domain',
    body: '{ pageId, domain }',
    response: '{ domain, status, dnsRecords }',
    auth: true,
  },

  // Branding
  {
    phase: 7,
    category: 'Customization',
    method: 'GET',
    endpoint: '/api/branding/[pageId]',
    description: 'Get theme configuration',
    params: ['pageId'],
    response: '{ theme, templates, css }',
    auth: true,
  },

  // Collaborators
  {
    phase: 7,
    category: 'Collaboration',
    method: 'POST',
    endpoint: '/api/collaborators',
    description: 'Add collaborator',
    body: '{ pageId, email, role }',
    response: '{ id, email, role }',
    auth: true,
  },

  // Advanced Rules
  {
    phase: 7,
    category: 'Advanced',
    method: 'POST',
    endpoint: '/api/advanced-rules',
    description: 'Create advanced rule',
    body: '{ pageId, ruleType, config }',
    response: '{ id, name, type, status }',
    auth: true,
  },

  // Health
  {
    phase: 6,
    category: 'System',
    method: 'GET',
    endpoint: '/api/health',
    description: 'Check system health',
    response: '{ status, checks, uptime }',
    auth: false,
  },

  // Status
  {
    phase: 7,
    category: 'System',
    method: 'GET',
    endpoint: '/api/status/phases',
    description: 'Get project status',
    response: '{ summary, phases, progress }',
    auth: false,
  },
]

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500/20 text-blue-300',
  POST: 'bg-emerald-500/20 text-emerald-300',
  PUT: 'bg-purple-500/20 text-purple-300',
  DELETE: 'bg-red-500/20 text-red-300',
}

export default function APIDocsPage() {
  const grouped = API_ENDPOINTS.reduce(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) {
        acc[endpoint.category] = []
      }
      acc[endpoint.category].push(endpoint)
      return acc
    },
    {} as Record<string, APIEndpoint[]>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">API Documentation</h1>
          <p className="text-gray-400 text-lg">Complete API reference for all endpoints</p>
        </div>

        {/* Endpoints by Category */}
        {Object.entries(grouped).map(([category, endpoints]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg border border-slate-600 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${methodColors[endpoint.method]}`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-white font-mono">{endpoint.endpoint}</code>
                        <span className={`px-2 py-1 rounded text-xs ${endpoint.auth ? 'bg-red-500/20 text-red-300' : 'bg-gray-600/20 text-gray-300'}`}>
                          {endpoint.auth ? '🔒 Auth' : '🔓 Public'}
                        </span>
                      </div>
                      <p className="text-gray-400">{endpoint.description}</p>
                    </div>
                    <span className="text-sm text-gray-500 ml-4">Phase {endpoint.phase}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700">
                    {endpoint.params && (
                      <div>
                        <div className="text-sm font-semibold text-gray-300 mb-2">Parameters</div>
                        <code className="text-sm text-blue-300 block">{endpoint.params.join(', ')}</code>
                      </div>
                    )}

                    {endpoint.body && (
                      <div>
                        <div className="text-sm font-semibold text-gray-300 mb-2">Request Body</div>
                        <code className="text-sm text-emerald-300 block">{endpoint.body}</code>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-semibold text-gray-300 mb-2">Response</div>
                      <code className="text-sm text-purple-300 block">{endpoint.response}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Auth Header Info */}
        <div className="mt-12 bg-slate-800 rounded-lg border border-slate-600 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Authentication</h3>
          <div className="text-gray-400">
            <p className="mb-3">
              All authenticated endpoints require the <code className="text-blue-300">Authorization</code> header:
            </p>
            <code className="block bg-slate-900 p-3 rounded text-sm text-gray-300">
              Authorization: Bearer &lt;sessionToken&gt;
            </code>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="text-gray-400 text-sm">Total Endpoints</div>
            <div className="text-2xl font-bold text-white">{API_ENDPOINTS.length}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="text-gray-400 text-sm">Public Endpoints</div>
            <div className="text-2xl font-bold text-emerald-400">
              {API_ENDPOINTS.filter((e) => !e.auth).length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="text-gray-400 text-sm">Protected Endpoints</div>
            <div className="text-2xl font-bold text-red-400">
              {API_ENDPOINTS.filter((e) => e.auth).length}
            </div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <div className="text-gray-400 text-sm">Categories</div>
            <div className="text-2xl font-bold text-blue-400">{Object.keys(grouped).length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
