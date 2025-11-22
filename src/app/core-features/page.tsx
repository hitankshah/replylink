'use client'

import React, { useState } from 'react'
import { CheckCircle2, AlertCircle, Code2, Server, Zap, BarChart3 } from 'lucide-react'

interface Feature {
  name: string
  description: string
  status: 'complete' | 'partial' | 'planned'
  phase: number
  implementation: {
    backend: string[]
    frontend: string[]
    database: string[]
    external: string[]
  }
  usageTracking?: {
    metric: string
    limit: string
    enforcement: string
  }[]
  key_endpoints?: string[]
}

const CORE_FEATURES: Feature[] = [
  {
    name: 'Link-in-Bio Pages',
    description: 'Create beautiful, customizable landing pages with drag-drop builder and multi-template support',
    status: 'complete',
    phase: 2,
    implementation: {
      backend: [
        'src/app/api/pages/route.ts - CRUD operations',
        'src/app/api/buttons/route.ts - Button management',
        'src/lib/prisma.ts - Database interactions'
      ],
      frontend: [
        'src/app/dashboard/pages/page.tsx - Pages list',
        'src/app/dashboard/pages/[id]/page.tsx - Page editor',
        'src/components/dashboard/PageBuilder.tsx - Builder component'
      ],
      database: [
        'LinkPage model with customization fields',
        'LinkButton model with actions',
        'Theme configuration storage'
      ],
      external: ['None']
    },
    key_endpoints: [
      'GET /api/pages - List user pages',
      'POST /api/pages - Create page',
      'PUT /api/pages/[id] - Update page',
      'DELETE /api/pages/[id] - Delete page',
      'GET /api/buttons - List page buttons',
      'POST /api/buttons - Add button'
    ]
  },
  {
    name: 'Auto-Reply Engine',
    description: 'Intelligent auto-replies for Instagram, Facebook & WhatsApp with rules engine and AI capabilities',
    status: 'complete',
    phase: 4,
    implementation: {
      backend: [
        'src/app/api/rules/route.ts - Rule creation/management',
        'src/app/api/webhooks/instagram/route.ts - IG webhook handler',
        'src/app/api/webhooks/facebook/route.ts - FB webhook handler',
        'src/app/api/webhooks/whatsapp/route.ts - WhatsApp webhook handler',
        'src/workers/processors/replyProcessor.ts - Reply processing queue'
      ],
      frontend: [
        'src/app/dashboard/rules/page.tsx - Rules dashboard',
        'src/components/dashboard/RuleBuilder.tsx - Rule builder'
      ],
      database: [
        'AutoReplyRule model',
        'RuleTrigger model',
        'RuleAction model'
      ],
      external: ['Meta API', 'WhatsApp Cloud API', 'BullMQ queues']
    },
    key_endpoints: [
      'POST /api/rules - Create rule',
      'GET /api/rules - List rules',
      'PUT /api/rules/[id] - Update rule',
      'DELETE /api/rules/[id] - Delete rule',
      'POST /api/webhooks/instagram - Instagram events',
      'POST /api/webhooks/facebook - Facebook events',
      'POST /api/webhooks/whatsapp - WhatsApp events'
    ]
  },
  {
    name: 'Real-Time Dashboard',
    description: 'Live analytics and activity monitoring with WebSocket updates and real-time metrics',
    status: 'complete',
    phase: 5,
    implementation: {
      backend: [
        'src/app/api/dashboard/stats/route.ts - Real-time stats',
        'src/app/api/activity/recent/route.ts - Activity feed',
        'src/lib/pusher.ts - WebSocket integration',
        'src/components/dashboard/LiveActivityFeed.tsx - Real-time feed'
      ],
      frontend: [
        'src/app/dashboard/page.tsx - Main dashboard',
        'src/components/dashboard/StatsCard.tsx - Stat cards',
        'src/components/dashboard/LiveActivityFeed.tsx - Live feed'
      ],
      database: [
        'PageView model',
        'ButtonClick model',
        'Activity event tracking'
      ],
      external: ['Pusher (or similar WebSocket service)']
    },
    key_endpoints: [
      'GET /api/dashboard/stats - Real-time stats',
      'GET /api/activity/recent - Recent activities',
      'WebSocket /ws/dashboard - Live updates'
    ]
  },
  {
    name: 'Multi-Platform Support',
    description: 'Unified management for Instagram, Facebook, WhatsApp, Twitter/X, TikTok, and LinkedIn accounts',
    status: 'complete',
    phase: 7,
    implementation: {
      backend: [
        'src/app/api/auth/social/connect/route.ts - OAuth flows',
        'src/app/api/auth/social/callback/route.ts - OAuth callbacks',
        'src/lib/social.ts - Social OAuth implementation',
        'src/app/api/auth/social/disconnect/route.ts - Account disconnect'
      ],
      frontend: [
        'src/app/dashboard/accounts/page.tsx - Accounts management',
        'src/components/dashboard/AccountConnector.tsx - OAuth UI'
      ],
      database: [
        'SocialAccount model with platform types',
        'OAuth token storage (encrypted)'
      ],
      external: ['Meta API', 'Twitter API', 'TikTok API', 'LinkedIn API']
    },
    key_endpoints: [
      'POST /api/auth/social/connect - Initiate OAuth',
      'GET /api/auth/social/callback - OAuth callback',
      'GET /api/auth/social/accounts - List accounts',
      'DELETE /api/auth/social/disconnect - Disconnect account'
    ]
  },
  {
    name: 'Advanced Analytics',
    description: 'Detailed insights into engagement, performance, device breakdown, and referrer tracking with CSV export',
    status: 'complete',
    phase: 7,
    implementation: {
      backend: [
        'src/lib/analytics.ts - Analytics engine',
        'src/app/api/analytics/page/[pageId]/route.ts - Page analytics',
        'src/components/dashboard/PageViewsChart.tsx - Views chart',
        'src/components/dashboard/ButtonClicksChart.tsx - Clicks chart'
      ],
      frontend: [
        'src/app/dashboard/analytics/page.tsx - Analytics dashboard',
        'src/components/dashboard/ReplyUsageChart.tsx - Usage chart'
      ],
      database: [
        'PageView model with device tracking',
        'ButtonClick model with referrer tracking',
        'Analytics aggregation cache'
      ],
      external: ['Redis caching']
    },
    usageTracking: [
      {
        metric: 'Page Views',
        limit: 'Plan-based (100K - Unlimited)',
        enforcement: 'Tracked in real-time, aggregated hourly'
      },
      {
        metric: 'Button Clicks',
        limit: 'Plan-based (10K - Unlimited)',
        enforcement: 'Tracked per button, aggregated in analytics'
      },
      {
        metric: 'Monthly Replies',
        limit: 'Plan-based (100 - Unlimited)',
        enforcement: 'Queue-based enforcement in reply processor'
      }
    ],
    key_endpoints: [
      'GET /api/analytics/page/[pageId] - Page analytics (JSON/CSV)',
      'GET /api/analytics/page/[pageId]?devices=true - Device breakdown',
      'GET /api/analytics/page/[pageId]?referrers=true - Referrer data'
    ]
  },
  {
    name: 'Subscription Management',
    description: 'Tiered plans with usage tracking, enforcement, and seamless upgrade/downgrade experience',
    status: 'complete',
    phase: 3,
    implementation: {
      backend: [
        'src/lib/billing/gateway.ts - Billing interface',
        'src/lib/billing/razorpay.ts - Razorpay integration',
        'src/lib/billing/paypal.ts - PayPal integration',
        'src/app/api/billing/create-subscription/route.ts - Subscription creation',
        'src/app/api/billing/cancel-subscription/route.ts - Subscription cancellation',
        'src/app/api/billing/webhooks/razorpay/route.ts - Razorpay webhooks',
        'src/app/api/billing/webhooks/paypal/route.ts - PayPal webhooks',
        'src/lib/middleware/planEnforcement.ts - Plan limit enforcement'
      ],
      frontend: [
        'src/app/dashboard/billing/page.tsx - Billing dashboard',
        'src/components/billing/PlanSelector.tsx - Plan selector'
      ],
      database: [
        'Subscription model with status tracking',
        'User.currentPlan field',
        'Payment history tracking'
      ],
      external: ['Razorpay API', 'PayPal API']
    },
    usageTracking: [
      {
        metric: 'Link Pages',
        limit: 'FREE: 1, STARTER: 5, PRO: 25, AGENCY: Unlimited',
        enforcement: 'Checked on page creation, error if limit exceeded'
      },
      {
        metric: 'Social Accounts',
        limit: 'FREE: 1, STARTER: 3, PRO: 10, AGENCY: Unlimited',
        enforcement: 'Checked on account connection, error if limit exceeded'
      },
      {
        metric: 'Monthly Auto-Replies',
        limit: 'FREE: 100, STARTER: 1K, PRO: 10K, AGENCY: Unlimited',
        enforcement: 'Queue-based, reply rejected if limit exceeded'
      }
    ],
    key_endpoints: [
      'POST /api/billing/create-subscription - Create subscription',
      'POST /api/billing/cancel-subscription - Cancel subscription',
      'GET /api/billing/info - Get billing info',
      'GET /api/billing/usage - Get current usage',
      'POST /api/billing/webhooks/razorpay - Razorpay webhook',
      'POST /api/billing/webhooks/paypal - PayPal webhook'
    ]
  }
]

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    complete: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    partial: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    planned: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
      {status.toUpperCase()}
    </span>
  )
}

export default function CoreFeaturesPage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Core Features Status</h1>
          <p className="text-slate-400 text-lg">
            Complete overview of ReplyLink's core functionality with implementation details
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-slate-400 text-sm">Total Features</p>
            </div>
            <p className="text-3xl font-bold text-white">{CORE_FEATURES.length}</p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <p className="text-slate-400 text-sm">Implementation Status</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {CORE_FEATURES.filter(f => f.status === 'complete').length}/{CORE_FEATURES.length}
            </p>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <p className="text-slate-400 text-sm">Completion Rate</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {Math.round((CORE_FEATURES.filter(f => f.status === 'complete').length / CORE_FEATURES.length) * 100)}%
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-4">
          {CORE_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors"
            >
              {/* Feature Header */}
              <button
                onClick={() =>
                  setExpandedFeature(expandedFeature === feature.name ? null : feature.name)
                }
                className="w-full p-6 flex items-start justify-between hover:bg-white/2 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 text-left">
                  <div className="mt-1">
                    {feature.status === 'complete' && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    )}
                    {feature.status === 'partial' && (
                      <AlertCircle className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{feature.name}</h3>
                    <p className="text-slate-400 mb-3">{feature.description}</p>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={feature.status} />
                      <span className="text-sm text-slate-500">Phase {feature.phase}</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedFeature === feature.name && (
                <div className="border-t border-white/5 px-6 py-6 bg-slate-950/20 space-y-6">
                  {/* Backend */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="w-5 h-5 text-blue-400" />
                      <h4 className="font-bold text-white">Backend Implementation</h4>
                    </div>
                    <ul className="space-y-2">
                      {feature.implementation.backend.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 ml-7">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Frontend */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 className="w-5 h-5 text-purple-400" />
                      <h4 className="font-bold text-white">Frontend Components</h4>
                    </div>
                    <ul className="space-y-2">
                      {feature.implementation.frontend.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 ml-7">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Database */}
                  <div>
                    <h4 className="font-bold text-white mb-3">Database Models</h4>
                    <ul className="space-y-2">
                      {feature.implementation.database.map((item, i) => (
                        <li key={i} className="text-sm text-slate-300 ml-7">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* External Services */}
                  {feature.implementation.external[0] !== 'None' && (
                    <div>
                      <h4 className="font-bold text-white mb-3">External Services</h4>
                      <ul className="space-y-2">
                        {feature.implementation.external.map((item, i) => (
                          <li key={i} className="text-sm text-slate-300 ml-7">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Usage Tracking */}
                  {feature.usageTracking && (
                    <div>
                      <h4 className="font-bold text-white mb-3">Usage Tracking & Limits</h4>
                      <div className="space-y-3">
                        {feature.usageTracking.map((usage, i) => (
                          <div key={i} className="bg-slate-900/50 border border-white/5 rounded-lg p-3">
                            <p className="font-semibold text-white text-sm mb-1">{usage.metric}</p>
                            <p className="text-xs text-slate-400 mb-1">
                              <span className="text-slate-300 font-medium">Limits:</span> {usage.limit}
                            </p>
                            <p className="text-xs text-slate-400">
                              <span className="text-slate-300 font-medium">Enforcement:</span> {usage.enforcement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* API Endpoints */}
                  {feature.key_endpoints && (
                    <div>
                      <h4 className="font-bold text-white mb-3">Key API Endpoints</h4>
                      <ul className="space-y-2">
                        {feature.key_endpoints.map((endpoint, i) => (
                          <li key={i} className="text-sm text-slate-300 ml-7 font-mono bg-slate-900/50 p-2 rounded">
                            {endpoint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Implementation Summary</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-slate-400 mb-2">
                <span className="font-semibold text-white">Backend API:</span> All core features have REST endpoints with proper authentication, validation, and error handling
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">
                <span className="font-semibold text-white">Database:</span> Full Prisma ORM models with optimized queries, indexes, and relationships
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">
                <span className="font-semibold text-white">Frontend UI:</span> React components with Tailwind CSS, real-time updates via Pusher, and responsive design
              </p>
            </div>
            <div>
              <p className="text-slate-400 mb-2">
                <span className="font-semibold text-white">Usage Tracking:</span> Plan-based limits enforced at API level with real-time quota monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
