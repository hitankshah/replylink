/**
 * Plan Enforcement Middleware
 * Checks if user has exceeded plan limits
 */

import { prisma } from '@/lib/prisma'

export interface PlanLimit {
  limit: number
  current: number
  exceeded: boolean
}

export interface PlanLimits {
  pages: PlanLimit
  accounts: PlanLimit
  monthlyReplies: PlanLimit
}

// Plan feature limits
const PLAN_LIMITS: Record<string, { pages: number; accounts: number; monthlyReplies: number }> = {
  FREE: {
    pages: 1,
    accounts: 1,
    monthlyReplies: 50,
  },
  STARTER: {
    pages: 3,
    accounts: 2,
    monthlyReplies: 500,
  },
  PRO: {
    pages: 10,
    accounts: 5,
    monthlyReplies: 2000,
  },
  AGENCY: {
    pages: 50,
    accounts: 20,
    monthlyReplies: 10000,
  },
}

/**
 * Check if user has exceeded page limit
 */
export async function checkPageLimit(userId: string): Promise<PlanLimit> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const planType = subscription?.planType || 'FREE'
  const limit = PLAN_LIMITS[planType]?.pages || 1

  const pageCount = await prisma.linkPage.count({
    where: { userId },
  })

  return {
    limit,
    current: pageCount,
    exceeded: pageCount >= limit,
  }
}

/**
 * Check if user has exceeded account limit
 */
export async function checkAccountLimit(userId: string): Promise<PlanLimit> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const planType = subscription?.planType || 'FREE'
  const limit = PLAN_LIMITS[planType]?.accounts || 1

  const accountCount = await prisma.socialAccount.count({
    where: { userId },
  })

  return {
    limit,
    current: accountCount,
    exceeded: accountCount >= limit,
  }
}

/**
 * Check if user has exceeded monthly reply limit
 */
export async function checkReplyLimit(userId: string): Promise<PlanLimit> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  })

  const planType = subscription?.planType || 'FREE'
  const limit = PLAN_LIMITS[planType]?.monthlyReplies || 50

  // Get current month usage
  const now = new Date()
  const monthlyUsage = await prisma.monthlyUsage.findUnique({
    where: {
      userId_year_month: {
        userId,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
    },
  })

  const current = monthlyUsage?.replies || 0

  return {
    limit,
    current,
    exceeded: current >= limit,
  }
}

/**
 * Get all plan limits for a user
 */
export async function getPlanLimits(userId: string): Promise<PlanLimits> {
  const [pages, accounts, replies] = await Promise.all([
    checkPageLimit(userId),
    checkAccountLimit(userId),
    checkReplyLimit(userId),
  ])

  return { pages, accounts, replies }
}

/**
 * Get upgrade URL for when limit is exceeded
 */
export function getUpgradeUrl(limitType: 'pages' | 'accounts' | 'replies'): string {
  return `/dashboard/billing?upgrade=${limitType}`
}
