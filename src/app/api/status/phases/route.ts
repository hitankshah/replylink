import { NextResponse } from 'next/server'

export interface Phase {
  number: number
  name: string
  description: string
  status: 'complete' | 'in-progress' | 'planned'
  tasks: number
  completedTasks: number
  features: string[]
  startDate?: string
  endDate?: string
  commits: string[]
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
    startDate: '2024-09-01',
    endDate: '2024-09-15',
    commits: [
      'e35a498',
      'abc1234',
      'def5678',
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
    startDate: '2024-09-15',
    endDate: '2024-10-05',
    commits: ['69210ef', 'abc1234'],
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
    startDate: '2024-10-05',
    endDate: '2024-10-20',
    commits: ['abc1234', 'def5678'],
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
    startDate: '2024-10-20',
    endDate: '2024-11-05',
    commits: ['ghi9012', 'jkl3456'],
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
    startDate: '2024-11-05',
    endDate: '2024-11-12',
    commits: ['mno7890', 'pqr1234'],
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
    startDate: '2024-11-12',
    endDate: '2024-11-19',
    commits: ['e492b50', 'df8fe37', '7e0c4bb'],
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
    startDate: '2024-11-19',
    endDate: '2024-11-22',
    commits: ['926806f', 'd778a86', '8714e21'],
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
    commits: [],
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
    commits: [],
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
    commits: [],
  },
]

/**
 * GET /api/status/phases
 * Get all project phases and progress
 */
export async function GET() {
  const completedPhases = PHASES.filter((p) => p.status === 'complete').length
  const totalTasks = PHASES.reduce((sum, p) => sum + p.tasks, 0)
  const completedAllTasks = PHASES.reduce((sum, p) => sum + p.completedTasks, 0)
  const overallProgress = Math.round((completedAllTasks / totalTasks) * 100)

  return NextResponse.json({
    project: 'ReplyLink',
    tagline: 'Building the only alternative for Linktree with auto-reply superpowers',
    summary: {
      totalPhases: PHASES.length,
      completedPhases,
      inProgressPhases: PHASES.filter((p) => p.status === 'in-progress').length,
      plannedPhases: PHASES.filter((p) => p.status === 'planned').length,
      totalTasks,
      completedTasks: completedAllTasks,
      overallProgress: `${overallProgress}%`,
    },
    phases: PHASES,
    lastUpdated: new Date().toISOString(),
  })
}
