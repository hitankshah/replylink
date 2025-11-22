import React from 'react'

interface Feature {
  phase: number
  category: string
  feature: string
  status: 'complete' | 'in-progress' | 'planned'
  details: string
  apis: string[]
}

const FEATURES: Feature[] = [
  // Phase 1
  { phase: 1, category: 'Foundation', feature: 'Next.js Setup', status: 'complete', details: 'TypeScript + React 18 + Next.js 14', apis: [] },
  { phase: 1, category: 'Foundation', feature: 'Database', status: 'complete', details: 'PostgreSQL + Prisma ORM', apis: [] },
  { phase: 1, category: 'Foundation', feature: 'Authentication', status: 'complete', details: 'JWT + Session Management', apis: ['/api/auth/login', '/api/auth/signup'] },

  // Phase 2
  { phase: 2, category: 'Link Pages', feature: 'Page Builder', status: 'complete', details: 'Create and customize link pages', apis: ['/api/pages', '/api/buttons'] },
  { phase: 2, category: 'Link Pages', feature: 'Analytics', status: 'complete', details: 'Track views and clicks', apis: ['/api/analytics'] },

  // Phase 3
  { phase: 3, category: 'Billing', feature: 'Subscriptions', status: 'complete', details: 'Free, Starter, Pro, Premium plans', apis: ['/api/billing', '/api/subscriptions'] },
  { phase: 3, category: 'Billing', feature: 'Payments', status: 'complete', details: 'Razorpay + PayPal integration', apis: ['/api/payments'] },

  // Phase 4
  { phase: 4, category: 'Auto-Reply', feature: 'Rules Engine', status: 'complete', details: 'Conditional logic for replies', apis: ['/api/rules'] },
  { phase: 4, category: 'Auto-Reply', feature: 'WhatsApp', status: 'complete', details: 'WhatsApp Cloud API integration', apis: ['/api/webhooks'] },

  // Phase 5
  { phase: 5, category: 'Workspaces', feature: 'Team Spaces', status: 'complete', details: 'Multi-workspace support', apis: ['/api/workspaces'] },
  { phase: 5, category: 'Workspaces', feature: 'Admin Panel', status: 'complete', details: 'System administration and monitoring', apis: ['/api/admin'] },

  // Phase 6
  { phase: 6, category: 'Security', feature: 'Input Validation', status: 'complete', details: 'Zod schema validation', apis: [] },
  { phase: 6, category: 'Security', feature: 'CSRF Protection', status: 'complete', details: 'CSRF token generation and verification', apis: ['/api/csrf-token'] },
  { phase: 6, category: 'Security', feature: 'Rate Limiting', status: 'complete', details: 'Plan-based rate limiting', apis: [] },
  { phase: 6, category: 'Performance', feature: 'Caching', status: 'complete', details: 'Redis-backed caching layer', apis: [] },
  { phase: 6, category: 'Performance', feature: 'Logging', status: 'complete', details: 'Structured JSON logging', apis: [] },
  { phase: 6, category: 'Performance', feature: 'Health Check', status: 'complete', details: 'Database, Redis, queue monitoring', apis: ['/api/health'] },

  // Phase 7
  { phase: 7, category: 'Linktree Features', feature: 'QR Codes', status: 'complete', details: 'Generate QR codes for pages', apis: ['/api/qr-code'] },
  { phase: 7, category: 'Linktree Features', feature: 'Link Shortener', status: 'complete', details: 'Create and track short links', apis: ['/api/short-links'] },
  { phase: 7, category: 'Linktree Features', feature: 'Advanced Analytics', status: 'complete', details: 'CTR, device breakdown, referrers', apis: ['/api/analytics/page'] },
  { phase: 7, category: 'Social', feature: 'Social Integration', status: 'complete', details: 'Facebook, Instagram, Twitter, TikTok, LinkedIn OAuth', apis: ['/api/auth/social'] },
  { phase: 7, category: 'Customization', feature: 'Custom Domains', status: 'complete', details: 'Domain mapping with DNS guidance', apis: ['/api/domains'] },
  { phase: 7, category: 'Customization', feature: 'Branding', status: 'complete', details: 'Themes, CSS, templates, color palettes', apis: ['/api/branding'] },
  { phase: 7, category: 'Collaboration', feature: 'Team Collab', status: 'complete', details: 'Roles, permissions, activity logs, comments', apis: ['/api/collaborators'] },
  { phase: 7, category: 'Advanced', feature: 'Rules Engine', status: 'complete', details: 'A/B testing, personalization, time-based', apis: ['/api/advanced-rules'] },
]

export default function FeatureMatrixPage() {
  const phaseGroups = FEATURES.reduce(
    (acc, feature) => {
      if (!acc[feature.phase]) {
        acc[feature.phase] = []
      }
      acc[feature.phase].push(feature)
      return acc
    },
    {} as Record<number, Feature[]>
  )

  const categoryGroups = FEATURES.reduce(
    (acc, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = []
      }
      acc[feature.category].push(feature)
      return acc
    },
    {} as Record<string, Feature[]>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Feature Matrix</h1>
          <p className="text-gray-400 text-lg">Complete feature inventory by phase and category</p>
        </div>

        {/* By Category */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">By Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryGroups).map(([category, features]) => (
              <div key={category} className="bg-slate-800 rounded-lg p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4 text-blue-400">{category}</h3>
                <ul className="space-y-3">
                  {features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-emerald-400 font-bold text-lg">✓</span>
                      <div>
                        <div className="text-white font-medium">{f.feature}</div>
                        <div className="text-gray-400 text-sm">{f.details}</div>
                        {f.apis.length > 0 && (
                          <div className="text-blue-300 text-xs mt-1 font-mono">
                            {f.apis.join(', ')}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-600 bg-slate-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phase</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Feature</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-semibold">
                      <span className="bg-slate-600 px-2 py-1 rounded">Phase {feature.phase}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{feature.category}</td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{feature.feature}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{feature.details}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          feature.status === 'complete'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : feature.status === 'in-progress'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-gray-600/20 text-gray-300'
                        }`}
                      >
                        {feature.status === 'complete' ? '✓ Done' : feature.status === 'in-progress' ? 'WIP' : 'Planned'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Complete Features</div>
            <div className="text-3xl font-bold text-emerald-400">
              {FEATURES.filter((f) => f.status === 'complete').length}
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">In Progress</div>
            <div className="text-3xl font-bold text-blue-400">
              {FEATURES.filter((f) => f.status === 'in-progress').length}
            </div>
          </div>
          <div className="bg-gray-600/10 border border-gray-600/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">Planned</div>
            <div className="text-3xl font-bold text-gray-400">
              {FEATURES.filter((f) => f.status === 'planned').length}
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-1">API Endpoints</div>
            <div className="text-3xl font-bold text-purple-400">20+</div>
          </div>
        </div>
      </div>
    </div>
  )
}
