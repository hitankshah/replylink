import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { FacebookAdapter } from '@/integrations/facebook/adapter'
import { webhookQueue } from '@/lib/queues'

/**
 * Facebook Webhook Receiver
 * 
 * Handles verification and event reception from Facebook Graph API.
 * Events are normalized and queued for processing.
 */

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN
const APP_SECRET = process.env.META_APP_SECRET

// GET Handler for Webhook Verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Facebook webhook verified')
      return new NextResponse(challenge, { status: 200 })
    } else {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return new NextResponse('Bad Request', { status: 400 })
}

// POST Handler for Event Reception
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    if (!APP_SECRET) {
      console.error('META_APP_SECRET not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Verify Signature
    if (signature) {
      const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', APP_SECRET)
        .update(body)
        .digest('hex')

      if (signature !== expectedSignature) {
        console.warn('Invalid Facebook webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const payload = JSON.parse(body)
    const adapter = new FacebookAdapter()
    
    // Parse and normalize events
    const events = await adapter.parseIncomingEvent(payload)

    // Queue events for processing
    for (const event of events) {
      await webhookQueue.add('process-webhook', {
        event,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing Facebook webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
