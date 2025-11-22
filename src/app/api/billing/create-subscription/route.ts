/**
 * Create Subscription API
 * Initiates a new subscription with the selected payment gateway
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { getBillingGateway } from '@/lib/billing'

export async function POST(req: NextRequest) {
  try {
    const sessionToken = cookies().get('sessionToken')?.value

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await getSessionUser(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planType, gateway } = await req.json()

    // Validate inputs
    if (!planType || !gateway) {
      return NextResponse.json(
        { error: 'Missing planType or gateway' },
        { status: 400 }
      )
    }

    if (!['razorpay', 'paypal'].includes(gateway)) {
      return NextResponse.json(
        { error: 'Invalid gateway' },
        { status: 400 }
      )
    }

    const validPlans = ['free', 'starter', 'pro', 'agency']
    if (!validPlans.includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Free plan doesn't need payment
    if (planType === 'free') {
      const subscription = await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          planType: 'FREE',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        update: {
          planType: 'FREE',
          status: 'ACTIVE',
        },
      })

      return NextResponse.json({
        success: true,
        planType: 'free',
        subscriptionId: subscription.id,
      })
    }

    // Get billing gateway
    const billingGateway = getBillingGateway(gateway as 'razorpay' | 'paypal')

    // Map plan types to gateway plan IDs (these would be configured in your gateway)
    const planMap: Record<string, string> = {
      starter: process.env[`${gateway.toUpperCase()}_STARTER_PLAN_ID`] || 'plan_starter',
      pro: process.env[`${gateway.toUpperCase()}_PRO_PLAN_ID`] || 'plan_pro',
      agency: process.env[`${gateway.toUpperCase()}_AGENCY_PLAN_ID`] || 'plan_agency',
    }

    const gatewayPlanId = planMap[planType]

    if (!gatewayPlanId) {
      return NextResponse.json(
        { error: 'Plan not configured for this gateway' },
        { status: 500 }
      )
    }

    // Create subscription through gateway
    const subscription = await billingGateway.createSubscription({
      planId: gatewayPlanId,
      customerId: user.id,
      email: user.email,
    })

    // Create pending subscription record in database
    const dbSubscription = await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        planType: planType.toUpperCase() as any,
        status: 'PENDING',
        externalId: subscription.subscriptionId,
        gateway: gateway.toUpperCase() as any,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      update: {
        planType: planType.toUpperCase() as any,
        status: 'PENDING',
        externalId: subscription.subscriptionId,
        gateway: gateway.toUpperCase() as any,
      },
    })

    return NextResponse.json({
      success: true,
      paymentUrl: subscription.paymentUrl,
      subscriptionId: dbSubscription.id,
      planType,
      gateway,
    })
  } catch (error: any) {
    console.error('Subscription creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: error.statusCode || 500 }
    )
  }
}
