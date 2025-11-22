import { NextRequest, NextResponse } from 'next/server'
import {
  createAdvancedRule,
  getPageRules,
  createABTest,
  getPageABTests,
  createPersonalizationRule,
  getPagePersonalizationRules,
  createTimeBasedRule,
  validateRuleConfig,
} from '@/lib/advancedRules'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/advanced-rules
 * Create advanced rule
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { pageId, ruleType, ...ruleData } = body

    if (!pageId || !ruleType) {
      return NextResponse.json(
        { error: 'pageId and ruleType are required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    let rule: any

    switch (ruleType) {
      case 'ab-test':
        rule = await createABTest(pageId, ruleData)
        break
      case 'personalization':
        rule = await createPersonalizationRule(pageId, ruleData)
        break
      case 'time-based':
        rule = await createTimeBasedRule(pageId, ruleData)
        break
      default:
        rule = await createAdvancedRule(pageId, { ...ruleData, type: ruleType })
    }

    // Validate rule
    if (!validateRuleConfig(rule)) {
      return NextResponse.json(
        { error: 'Invalid rule configuration' },
        { status: 400 }
      )
    }

    return NextResponse.json(rule, { status: 201 })
  } catch (error) {
    console.error('Rule creation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to create rule'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

/**
 * GET /api/advanced-rules?pageId=xxx
 * Get page rules
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const pageId = request.nextUrl.searchParams.get('pageId')
    const ruleType = request.nextUrl.searchParams.get('type')

    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      )
    }

    // Verify user owns the page
    const page = await prisma.linkPage.findUnique({
      where: { id: pageId },
      select: { userId: true },
    })

    if (!page || page.userId !== user.id) {
      return NextResponse.json(
        { error: 'Page not found or unauthorized' },
        { status: 404 }
      )
    }

    let rules: any[]

    if (ruleType === 'ab-test') {
      rules = await getPageABTests(pageId)
    } else if (ruleType === 'personalization') {
      rules = await getPagePersonalizationRules(pageId)
    } else {
      rules = await getPageRules(pageId)
    }

    return NextResponse.json({ rules })
  } catch (error) {
    console.error('Error fetching rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rules' },
      { status: 500 }
    )
  }
}
