import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

/**
 * Razorpay Webhook Handler
 * 
 * Receives and processes webhook events from Razorpay for subscription lifecycle
 * Verifies signature using HMAC-SHA256
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.warn('Invalid Razorpay webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const payload = JSON.parse(body)
    const event = payload.event
    const eventData = payload.payload

    console.log(`[Razorpay Webhook] Received event: ${event}`)

    // Route to appropriate handler based on event type
    switch (event) {
      case 'subscription.authenticated':
        await handleSubscriptionAuthenticated(eventData)
        break
      case 'subscription.activated':
        await handleSubscriptionActivated(eventData)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(eventData)
        break
      case 'subscription.paused':
        await handleSubscriptionPaused(eventData)
        break
      case 'subscription.resumed':
        await handleSubscriptionResumed(eventData)
        break
      default:
        console.log(`[Razorpay Webhook] Unhandled event type: ${event}`)
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Razorpay Webhook] Error processing webhook:', error)
    // Still return 200 to prevent Razorpay from retrying
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 200 }
    )
  }
}

/**
 * Handle subscription.authenticated event
 * Triggered when customer completes initial payment authorization
 */
async function handleSubscriptionAuthenticated(eventData: any) {
  try {
    const subscriptionId = eventData.subscription.id
    const customerId = eventData.subscription.customer_id

    console.log(`[Razorpay] Subscription authenticated: ${subscriptionId}`)

    // Find subscription in our database by external ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        externalId: subscriptionId,
        gateway: 'razorpay',
      },
      include: { user: true },
    })

    if (!subscription) {
      console.warn(
        `[Razorpay] Subscription not found in database: ${subscriptionId}`
      )
      return
    }

    // Update subscription status to AUTHENTICATED (waiting for first payment)
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'AUTHENTICATED',
      },
    })

    console.log(
      `[Razorpay] Updated subscription status to AUTHENTICATED: ${subscriptionId}`
    )
  } catch (error) {
    console.error(
      '[Razorpay] Error handling subscription.authenticated:',
      error
    )
  }
}

/**
 * Handle subscription.activated event
 * Triggered when subscription becomes active and first payment is confirmed
 */
async function handleSubscriptionActivated(eventData: any) {
  try {
    const subscriptionId = eventData.subscription.id
    const planId = eventData.subscription.plan_id
    const currentStart = eventData.subscription.current_start
    const currentEnd = eventData.subscription.current_end

    console.log(`[Razorpay] Subscription activated: ${subscriptionId}`)

    // Find subscription in our database
    const subscription = await prisma.subscription.findFirst({
      where: {
        externalId: subscriptionId,
        gateway: 'razorpay',
      },
      include: { user: true },
    })

    if (!subscription) {
      console.warn(
        `[Razorpay] Subscription not found in database: ${subscriptionId}`
      )
      return
    }

    // Determine plan type from plan ID (stored during creation)
    // Update subscription to ACTIVE status
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: new Date(currentStart * 1000),
        currentPeriodEnd: new Date(currentEnd * 1000),
      },
    })

    // Update user's current plan
    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        currentPlan: subscription.planType,
      },
    })

    console.log(
      `[Razorpay] Subscription activated and user plan updated: ${subscription.userId}`
    )
  } catch (error) {
    console.error('[Razorpay] Error handling subscription.activated:', error)
  }
}

/**
 * Handle subscription.cancelled event
 * Triggered when subscription is cancelled by customer or Razorpay
 */
async function handleSubscriptionCancelled(eventData: any) {
  try {
    const subscriptionId = eventData.subscription.id

    console.log(`[Razorpay] Subscription cancelled: ${subscriptionId}`)

    // Find subscription in our database
    const subscription = await prisma.subscription.findFirst({
      where: {
        externalId: subscriptionId,
        gateway: 'razorpay',
      },
      include: { user: true },
    })

    if (!subscription) {
      console.warn(
        `[Razorpay] Subscription not found in database: ${subscriptionId}`
      )
      return
    }

    // Update subscription status to CANCELLED
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
      },
    })

    // Downgrade user to FREE plan
    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        currentPlan: 'FREE',
      },
    })

    console.log(
      `[Razorpay] Subscription cancelled and user downgraded to FREE: ${subscription.userId}`
    )
  } catch (error) {
    console.error('[Razorpay] Error handling subscription.cancelled:', error)
  }
}

/**
 * Handle subscription.paused event
 * Triggered when subscription is temporarily paused
 */
async function handleSubscriptionPaused(eventData: any) {
  try {
    const subscriptionId = eventData.subscription.id

    console.log(`[Razorpay] Subscription paused: ${subscriptionId}`)

    const subscription = await prisma.subscription.findFirst({
      where: {
        externalId: subscriptionId,
        gateway: 'razorpay',
      },
    })

    if (!subscription) {
      console.warn(
        `[Razorpay] Subscription not found in database: ${subscriptionId}`
      )
      return
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'PAUSED',
      },
    })

    console.log(`[Razorpay] Updated subscription status to PAUSED: ${subscriptionId}`)
  } catch (error) {
    console.error('[Razorpay] Error handling subscription.paused:', error)
  }
}

/**
 * Handle subscription.resumed event
 * Triggered when paused subscription is resumed
 */
async function handleSubscriptionResumed(eventData: any) {
  try {
    const subscriptionId = eventData.subscription.id

    console.log(`[Razorpay] Subscription resumed: ${subscriptionId}`)

    const subscription = await prisma.subscription.findFirst({
      where: {
        externalId: subscriptionId,
        gateway: 'razorpay',
      },
      include: { user: true },
    })

    if (!subscription) {
      console.warn(
        `[Razorpay] Subscription not found in database: ${subscriptionId}`
      )
      return
    }

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
      },
    })

    // Update user's plan
    await prisma.user.update({
      where: { id: subscription.userId },
      data: {
        currentPlan: subscription.planType,
      },
    })

    console.log(
      `[Razorpay] Subscription resumed and user plan updated: ${subscription.userId}`
    )
  } catch (error) {
    console.error('[Razorpay] Error handling subscription.resumed:', error)
  }
}
