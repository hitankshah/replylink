import React, { useState } from 'react'

interface Phase {
  number: number
  name: string
  description: string
  status: 'complete' | 'in-progress' | 'planned'
  tasks: number
  completedTasks: number
  features: string[]
  files: string[]
}

const PHASES: Phase[] = [
  {
    number: 1,
    name: 'Foundation',
    description: 'Core infrastructure, authentication, and database setup',
    status: 'complete',
    tasks: 4,
    completedTasks: 4,
    features: [
      'Next.js 14 setup with TypeScript',
      'PostgreSQL database with Prisma ORM',
      'JWT authentication',
      'Session management',
      'Global styles and theme',
    ],
    files: [
      'next.config.js',
      'prisma/schema.prisma',
      'src/lib/auth.ts',
      'src/middleware.ts',
    ],
  },
  {
    number: 2,
    name: 'Link Page Builder',
    description: 'Complete link-in-bio page creation and management system',
    status: 'complete',
    tasks: 20,
    completedTasks: 20,
    features: [
      'Login/signup authentication',
      'Link page creation and editing',
      'Button management',
      'Page customization',
      'Public link pages',
      'Analytics tracking',
    ],
    files: [
      'src/app/dashboard/pages',
      'src/app/api/pages',
      'src/app/api/buttons',
      'src/components/dashboard/PageBuilder',
    ],
  },
  {
    number: 3,
    name: 'Billing System',
    description: 'Subscription plans, payments, and usage tracking',
    status: 'complete',
    tasks: 11,
    completedTasks: 11,
    features: [
      'Subscription plans (Free, Starter, Pro, Premium)',
      'Razorpay integration',
      'PayPal integration',
      'Usage tracking',
      'Plan upgrades/downgrades',
      'Billing dashboard',
    ],
    files: [
      'src/lib/billing.ts',
      'src/app/api/billing',
      'src/app/dashboard/billing',
    ],
  },
  {
    number: 4,
    name: 'Auto-Reply Rules',
    description: 'Conditional auto-reply system with multiple triggers and actions',
    status: 'complete',
    tasks: 18,
    completedTasks: 18,
    features: [
      'WhatsApp integration',
      'Conditional rules engine',
      'Message templating',
      'Webhook handling',
      'Job queue processing',
      'Rule execution logging',
    ],
    files: [
      'src/lib/rules.ts',
      'src/workers/processors/replyProcessor.ts',
      'src/app/api/webhooks',
    ],
  },
  {
    number: 5,
    name: 'Workspaces & Admin',
    description: 'Team collaboration and admin panel',
    status: 'complete',
    tasks: 7,
    completedTasks: 7,
    features: [
      'Workspace creation',
      'Member invitations',
      'Role-based access',
      'Admin dashboard',
      'System monitoring',
      'User management',
    ],
    files: [
      'src/lib/workspace.ts',
      'src/app/dashboard/admin',
      'src/app/api/workspaces',
    ],
  },
  {
    number: 6,
    name: 'Production Hardening',
    description: 'Security, performance, and reliability features',
    status: 'complete',
    tasks: 8,
    completedTasks: 8,
    features: [
      'Input validation with Zod',
      'CSRF protection',
      'Rate limiting',
      'Structured logging',
      'Error tracking (Sentry)',
      'Database optimization',
      'Redis caching',
      'Health check endpoint',
    ],
    files: [
      'src/lib/validators',
      'src/lib/csrf.ts',
      'src/lib/rateLimit.ts',
      'src/lib/logger.ts',
      'src/lib/sentry.ts',
      'src/lib/cache.ts',
      'src/app/api/health',
    ],
  },
  {
    number: 7,
    name: 'Linktree Parity',
    description: 'Core Linktree feature parity and competitive advantages',
    status: 'complete',
    tasks: 8,
    completedTasks: 8,
    features: [
      'QR code generation',
      'Link shortener',
      'Advanced analytics',
      'Social media integration (Facebook, Instagram, Twitter, TikTok, LinkedIn)',
      'Custom domains',
      'Advanced branding and themes',
      'Team collaboration',
      'Advanced rules engine (A/B testing, personalization, time-based)',
    ],
    files: [
      'src/lib/qrCode.ts',
      'src/lib/shortLink.ts',
      'src/lib/analytics.ts',
      'src/lib/social.ts',
      'src/lib/customDomain.ts',
      'src/lib/branding.ts',
      'src/lib/collaboration.ts',
      'src/lib/advancedRules.ts',
    ],
  },
  {
    number: 8,
    name: 'Mobile App',
    description: 'Native iOS and Android applications',
    status: 'planned',
    tasks: 15,
    completedTasks: 0,
    features: [
      'React Native setup',
      'Authentication flow',
      'Page management',
      'Analytics dashboard',
      'Push notifications',
      'Offline support',
    ],
    files: [],
  },
  {
    number: 9,
    name: 'Team Workspace v2',
    description: 'Advanced team collaboration features',
    status: 'planned',
    tasks: 12,
    completedTasks: 0,
    features: [
      'Multi-workspace management',
      'Advanced permissions',
      'Page sharing',
      'Bulk operations',
      'Team analytics',
    ],
    files: [],
  },
  {
    number: 10,
    name: 'Marketplace',
    description: 'Third-party integrations and extensions',
    status: 'planned',
    tasks: 10,
    completedTasks: 0,
    features: [
      'Plugin system',
      'Third-party apps',
      'Custom integrations',
      'API webhooks',
      'App store',
    ],
    files: [],
  },
]

export default function ProjectStatusPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)

  const completedPhases = PHASES.filter((p) => p.status === 'complete').length
  const totalTasks = PHASES.reduce((sum, p) => sum + p.tasks, 0)
  const completedAllTasks = PHASES.reduce((sum, p) => sum + p.completedTasks, 0)
  const overallProgress = Math.round((completedAllTasks / totalTasks) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">ReplyLink Development Status</h1>
          <p className="text-gray-400 text-lg">Track the progress of all development phases</p>
        </div>

        {/* Overall Progress */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="text-gray-400 text-sm mb-2">Overall Progress</div>
            <div className="text-3xl font-bold text-white mb-2">{overallProgress}%</div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="text-gray-400 text-sm mb-2">Phases Complete</div>
            <div className="text-3xl font-bold text-emerald-400">{completedPhases}/10</div>
            <div className="text-gray-500 text-xs mt-2">{10 - completedPhases} remaining</div>
          </div>

          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="text-gray-400 text-sm mb-2">Total Tasks</div>
            <div className="text-3xl font-bold text-blue-400">{completedAllTasks}/{totalTasks}</div>
            <div className="text-gray-500 text-xs mt-2">tasks completed</div>
          </div>

          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <div className="text-gray-400 text-sm mb-2">Status</div>
            <div className="text-3xl font-bold text-purple-400">7 Phases</div>
            <div className="text-gray-500 text-xs mt-2">Production Ready</div>
          </div>
        </div>

        {/* Phases Grid */}
        <div className="grid gap-4">
          {PHASES.map((phase) => (
            <div
              key={phase.number}
              className={`rounded-lg border transition-all duration-300 cursor-pointer ${
                expandedPhase === phase.number
                  ? 'border-purple-500 bg-slate-700'
                  : 'border-slate-600 bg-slate-800 hover:border-slate-500'
              }`}
              onClick={() => setExpandedPhase(expandedPhase === phase.number ? null : phase.number)}
            >
              {/* Phase Header */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          phase.status === 'complete'
                            ? 'bg-emerald-500'
                            : phase.status === 'in-progress'
                              ? 'bg-blue-500'
                              : 'bg-gray-600'
                        }`}
                      >
                        {phase.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Phase {phase.number}: {phase.name}</h3>
                        <p className="text-gray-400 text-sm">{phase.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {phase.completedTasks}/{phase.tasks}
                      </div>
                      <div className="text-gray-400 text-xs">Tasks</div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        phase.status === 'complete'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : phase.status === 'in-progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-600/20 text-gray-300'
                      }`}
                    >
                      {phase.status === 'complete' ? '✓ Complete' : phase.status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 w-full bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      phase.status === 'complete'
                        ? 'bg-emerald-500'
                        : phase.status === 'in-progress'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                    }`}
                    style={{ width: `${(phase.completedTasks / phase.tasks) * 100}%` }}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPhase === phase.number && (
                <div className="border-t border-slate-600 p-6 bg-slate-800/50">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Features */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                      <ul className="space-y-2">
                        {phase.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Files */}
                    {phase.files.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Key Files</h4>
                        <ul className="space-y-2">
                          {phase.files.map((file, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm font-mono">
                              <span className="text-blue-400 mt-1">→</span>
                              <span>{file}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 p-6 bg-slate-700 rounded-lg border border-slate-600">
          <h4 className="text-white font-semibold mb-4">Legend</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-gray-300">Complete</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-300">In Progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-600" />
              <span className="text-gray-300">Planned</span>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p className="mt-1">
            ReplyLink - Building the only alternative for Linktree with auto-reply superpowers
          </p>
        </div>
      </div>
    </div>
  )
}
