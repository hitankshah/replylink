import { prisma } from '@/lib/prisma'
import { cache } from '@/lib/cache'

export interface AdvancedRule {
  id: string
  name: string
  type: 'redirect' | 'ab-test' | 'personalization' | 'time-based' | 'conditional'
  triggers: {
    condition: string
    operator: 'equals' | 'contains' | 'matches' | 'between'
    value: any
  }[]
  actions: {
    type: string
    target: string
    metadata?: Record<string, any>
  }[]
  isActive: boolean
  priority: number
  createdAt: Date
}

export interface ABTestRule {
  id: string
  pageId: string
  name: string
  variants: {
    id: string
    name: string
    weight: number
    config: Record<string, any>
  }[]
  metric: 'clicks' | 'views' | 'time'
  duration: number
  winner?: string
  results?: Record<string, any>
}

export interface PersonalizationRule {
  id: string
  pageId: string
  condition: {
    field: 'country' | 'device' | 'referrer' | 'time' | 'language'
    operator: string
    value: any
  }
  action: {
    type: 'show' | 'hide' | 'highlight' | 'redirect'
    target: string
  }
}

export interface TimeBasedRule {
  id: string
  pageId: string
  name: string
  schedule: {
    startTime: Date
    endTime: Date
    timezone: string
    recurring?: {
      frequency: 'daily' | 'weekly' | 'monthly'
      daysOfWeek?: number[]
    }
  }
  action: {
    type: 'show' | 'hide' | 'redirect' | 'message'
    target: string
  }
}

/**
 * Create advanced rule
 */
export async function createAdvancedRule(
  pageId: string,
  rule: Partial<AdvancedRule>
): Promise<AdvancedRule> {
  // In production, create in rules table
  const newRule: AdvancedRule = {
    id: 'rule_' + Date.now(),
    name: rule.name || 'Untitled Rule',
    type: rule.type || 'redirect',
    triggers: rule.triggers || [],
    actions: rule.actions || [],
    isActive: rule.isActive !== false,
    priority: rule.priority || 0,
    createdAt: new Date(),
  }

  // Cache invalidation
  await cache.del(`rules:page:${pageId}`)

  return newRule
}

/**
 * Get page rules
 */
export async function getPageRules(pageId: string): Promise<AdvancedRule[]> {
  const cacheKey = `rules:page:${pageId}`
  const cached = await cache.get<AdvancedRule[]>(cacheKey)
  if (cached) {
    return cached
  }

  // In production, fetch from rules table
  const rules: AdvancedRule[] = []

  // Cache for 1 hour
  await cache.set(cacheKey, rules, { ttl: 3600 })

  return rules
}

/**
 * Create A/B test
 */
export async function createABTest(
  pageId: string,
  test: Partial<ABTestRule>
): Promise<ABTestRule> {
  if (!test.variants || test.variants.length < 2) {
    throw new Error('A/B test requires at least 2 variants')
  }

  // Validate weights sum to 100
  const totalWeight = test.variants.reduce((sum, v) => sum + (v.weight || 50), 0)
  if (totalWeight !== 100) {
    throw new Error('Variant weights must sum to 100%')
  }

  const newTest: ABTestRule = {
    id: 'abtest_' + Date.now(),
    pageId,
    name: test.name || 'Untitled A/B Test',
    variants: test.variants.map((v, i) => ({
      id: 'variant_' + i,
      name: v.name || `Variant ${i + 1}`,
      weight: v.weight || 50,
      config: v.config || {},
    })),
    metric: test.metric || 'clicks',
    duration: test.duration || 7,
    results: {},
  }

  // Cache invalidation
  await cache.del(`rules:page:${pageId}`)
  await cache.del(`abtests:page:${pageId}`)

  return newTest
}

/**
 * Get A/B tests for page
 */
export async function getPageABTests(pageId: string): Promise<ABTestRule[]> {
  const cacheKey = `abtests:page:${pageId}`
  const cached = await cache.get<ABTestRule[]>(cacheKey)
  if (cached) {
    return cached
  }

  // In production, fetch from ab_tests table
  const tests: ABTestRule[] = []

  // Cache for 1 hour
  await cache.set(cacheKey, tests, { ttl: 3600 })

  return tests
}

/**
 * Create personalization rule
 */
export async function createPersonalizationRule(
  pageId: string,
  rule: Partial<PersonalizationRule>
): Promise<PersonalizationRule> {
  const newRule: PersonalizationRule = {
    id: 'personalize_' + Date.now(),
    pageId,
    condition: rule.condition || {
      field: 'country',
      operator: 'equals',
      value: 'US',
    },
    action: rule.action || {
      type: 'show',
      target: '',
    },
  }

  // Cache invalidation
  await cache.del(`personalization:page:${pageId}`)

  return newRule
}

/**
 * Get personalization rules for page
 */
export async function getPagePersonalizationRules(
  pageId: string
): Promise<PersonalizationRule[]> {
  const cacheKey = `personalization:page:${pageId}`
  const cached = await cache.get<PersonalizationRule[]>(cacheKey)
  if (cached) {
    return cached
  }

  // In production, fetch from personalization_rules table
  const rules: PersonalizationRule[] = []

  // Cache for 1 hour
  await cache.set(cacheKey, rules, { ttl: 3600 })

  return rules
}

/**
 * Create time-based rule
 */
export async function createTimeBasedRule(
  pageId: string,
  rule: Partial<TimeBasedRule>
): Promise<TimeBasedRule> {
  const newRule: TimeBasedRule = {
    id: 'timebased_' + Date.now(),
    pageId,
    name: rule.name || 'Untitled Time-Based Rule',
    schedule: rule.schedule || {
      startTime: new Date(),
      endTime: new Date(),
      timezone: 'UTC',
    },
    action: rule.action || {
      type: 'show',
      target: '',
    },
  }

  // Cache invalidation
  await cache.del(`timebased:page:${pageId}`)

  return newRule
}

/**
 * Evaluate rule for request
 */
export async function evaluateRule(
  rule: AdvancedRule,
  context: Record<string, any>
): Promise<boolean> {
  if (!rule.isActive) {
    return false
  }

  // Evaluate all triggers (AND logic)
  return rule.triggers.every((trigger) =>
    evaluateTrigger(trigger, context)
  )
}

/**
 * Evaluate a single trigger
 */
function evaluateTrigger(
  trigger: AdvancedRule['triggers'][0],
  context: Record<string, any>
): boolean {
  const contextValue = context[trigger.condition]

  switch (trigger.operator) {
    case 'equals':
      return contextValue === trigger.value
    case 'contains':
      return String(contextValue).includes(String(trigger.value))
    case 'matches':
      return new RegExp(trigger.value).test(String(contextValue))
    case 'between':
      return contextValue >= trigger.value[0] && contextValue <= trigger.value[1]
    default:
      return false
  }
}

/**
 * Get rule results/analytics
 */
export async function getRuleResults(ruleId: string): Promise<any> {
  const cacheKey = `rule-results:${ruleId}`
  const cached = await cache.get<any>(cacheKey)
  if (cached) {
    return cached
  }

  const results = {
    triggers: 0,
    actions: 0,
    conversionRate: 0,
  }

  // Cache for 1 hour
  await cache.set(cacheKey, results, { ttl: 3600 })

  return results
}

/**
 * Export rule configuration
 */
export function exportRuleConfig(rule: AdvancedRule): string {
  return JSON.stringify(rule, null, 2)
}

/**
 * Import rule configuration
 */
export function importRuleConfig(json: string): AdvancedRule {
  return JSON.parse(json)
}

/**
 * Validate rule configuration
 */
export function validateRuleConfig(rule: Partial<AdvancedRule>): boolean {
  if (!rule.name) return false
  if (!rule.type) return false
  if (!Array.isArray(rule.triggers)) return false
  if (!Array.isArray(rule.actions)) return false

  return true
}
