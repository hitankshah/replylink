import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

/**
 * Rule Test API
 * POST: Test rule against sample event (dry-run)
 * Returns: What would happen if this rule matched
 */

async function getSession(request: NextRequest) {
  const sessionToken = cookies().get('sessionToken')?.value
  if (!sessionToken) return null

  return await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  })
}

function evaluateRuleTrigger(
  trigger: {
    type: string
    keywords?: string[]
    operator?: string
    scheduledTime?: string
    daysOfWeek?: number[]
  },
  eventData: {
    content?: string
    eventType?: string
    senderName?: string
    timestamp?: string
  }
): boolean {
  switch (trigger.type) {
    case 'COMMENT_KEYWORD':
    case 'DM_KEYWORD':
      if (!trigger.keywords || !eventData.content) return false
      return trigger.keywords.some((keyword) =>
        eventData.content!.toLowerCase().includes(keyword.toLowerCase())
      )

    case 'MENTION':
      return eventData.eventType === 'mention'

    case 'FIRST_TIME_DM':
      return eventData.eventType === 'first_message'

    case 'OUT_OF_HOURS':
      if (!trigger.scheduledTime || !eventData.timestamp) return false
      const eventHour = new Date(eventData.timestamp).getHours()
      const triggerHour = parseInt(trigger.scheduledTime.split(':')[0])
      return eventHour === triggerHour

    case 'STORY_REPLY':
      return eventData.eventType === 'story_reply'

    default:
      return false
  }
}

function renderTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template
  result = result.replace(/{userName}/g, variables.userName || '@user')
  result = result.replace(/{linkPageUrl}/g, variables.linkPageUrl || 'https://link.page')
  result = result.replace(/{date}/g, variables.date || new Date().toLocaleDateString())
  result = result.replace(/{time}/g, variables.time || new Date().toLocaleTimeString())
  return result
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rule = await prisma.rule.findUnique({
      where: { id: params.id },
      include: {
        account: {
          select: {
            username: true,
            platform: true,
          },
        },
      },
    })

    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 })
    }

    // Verify ownership
    if (rule.userId !== session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    // Validate test event
    if (!body.testEvent) {
      return NextResponse.json(
        { error: 'testEvent is required' },
        { status: 400 }
      )
    }

    const testEvent = body.testEvent

    // Check if rule trigger matches
    const triggerConfig = rule.triggerConfig as any
    const triggerMatched = evaluateRuleTrigger(
      {
        type: rule.triggerType,
        keywords: triggerConfig.keywords,
        operator: triggerConfig.operator,
        scheduledTime: triggerConfig.scheduledTime,
        daysOfWeek: triggerConfig.daysOfWeek,
      },
      {
        content: testEvent.content || '',
        eventType: testEvent.eventType || '',
        senderName: testEvent.senderName || '',
        timestamp: testEvent.timestamp || new Date().toISOString(),
      }
    )

    if (!triggerMatched) {
      return NextResponse.json(
        {
          matched: false,
          message: 'Rule trigger did not match the test event',
          would_have_done: null,
        },
        { status: 200 }
      )
    }

    // Render the action template
    const actionConfig = rule.actionConfig as any
    const renderedMessage = renderTemplate(actionConfig.message || '', {
      userName: testEvent.senderName || 'User',
      linkPageUrl: testEvent.linkPageUrl || 'https://link.page',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    })

    return NextResponse.json(
      {
        matched: true,
        message: 'Rule trigger matched successfully',
        would_have_done: {
          action: rule.actionType || 'REPLY_COMMENT',
          platform: rule.account.platform,
          account: rule.account.username,
          messagePreview: renderedMessage,
          priority: rule.priority,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error testing rule:', error)
    return NextResponse.json(
      { error: 'Failed to test rule' },
      { status: 500 }
    )
  }
}
