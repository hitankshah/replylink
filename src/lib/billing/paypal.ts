/**
 * PayPal Payment Gateway Implementation
 */

import crypto from 'crypto'
import {
  IBillingGateway,
  CreateSubscriptionParams,
  CancelSubscriptionParams,
  WebhookPayload,
  PaymentVerification,
  SubscriptionResponse,
  PaymentResponse,
  GatewayError,
  ValidationError,
} from './gateway'

export class PayPalGateway implements IBillingGateway {
  private baseUrl: string
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID || ''
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET || ''

    if (!this.clientId || !this.clientSecret) {
      throw new Error('PayPal credentials not configured')
    }

    this.baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://api.paypal.com'
        : 'https://api.sandbox.paypal.com'
  }

  /**
   * Get PayPal access token
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })

      const data: any = await response.json()

      if (!response.ok) {
        throw new GatewayError(data.error_description || 'Failed to get access token')
      }

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in - 300) * 1000 // Refresh 5 min early

      return this.accessToken
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Failed to authenticate with PayPal',
        'PAYPAL_AUTH_ERROR'
      )
    }
  }

  /**
   * Create a subscription on PayPal
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResponse> {
    try {
      const { planId, customerId, email } = params

      const token = await this.getAccessToken()

      // Create subscription
      const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          plan_id: planId,
          subscriber: {
            email_address: email,
          },
          application_context: {
            brand_name: 'ReplyLink',
            locale: 'en-US',
            user_action: 'SUBSCRIBE_NOW',
            payment_method: {
              payer_selected: 'PAYPAL',
              payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
            },
            return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing/return`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing/cancel`,
          },
        }),
      })

      const data: any = await response.json()

      if (!response.ok) {
        throw new GatewayError(data.message || 'Failed to create subscription')
      }

      // Find approval link
      const approvalLink = data.links?.find((link: any) => link.rel === 'approve')?.href

      if (!approvalLink) {
        throw new GatewayError('No approval link in PayPal response')
      }

      return {
        subscriptionId: data.id,
        paymentUrl: approvalLink,
        status: 'pending',
        amount: 0, // Amount from plan
        currency: 'USD',
        interval: 'monthly',
      }
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Failed to create subscription',
        'PAYPAL_CREATE_ERROR'
      )
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(params: CancelSubscriptionParams): Promise<PaymentResponse> {
    try {
      const { subscriptionId, reason = 'Cancelled by user' } = params

      const token = await this.getAccessToken()

      const response = await fetch(
        `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reason: reason,
          }),
        }
      )

      if (!response.ok && response.status !== 204) {
        throw new GatewayError('Failed to cancel subscription')
      }

      return {
        success: true,
        transactionId: subscriptionId,
        amount: 0,
        status: 'cancelled',
      }
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Failed to cancel subscription',
        'PAYPAL_CANCEL_ERROR'
      )
    }
  }

  /**
   * Verify webhook signature and process event
   */
  async handleWebhook(payload: WebhookPayload): Promise<{ success: boolean; event: string }> {
    try {
      const { data } = payload

      // In production, verify PayPal webhook signature
      if (process.env.NODE_ENV === 'production') {
        const isValid = await this.verifyWebhookSignature(payload)
        if (!isValid) {
          throw new ValidationError('Invalid webhook signature')
        }
      }

      const event = data.event_type

      // Handle different webhook events
      switch (event) {
        case 'BILLING.SUBSCRIPTION.ACTIVATED':
          return { success: true, event: 'subscription.activated' }

        case 'BILLING.SUBSCRIPTION.UPDATED':
          return { success: true, event: 'subscription.updated' }

        case 'BILLING.SUBSCRIPTION.CANCELLED':
          return { success: true, event: 'subscription.cancelled' }

        case 'PAYMENT.SALE.COMPLETED':
          return { success: true, event: 'payment.completed' }

        case 'PAYMENT.SALE.DENIED':
          return { success: true, event: 'payment.denied' }

        default:
          console.warn(`Unknown PayPal webhook event: ${event}`)
          return { success: true, event }
      }
    } catch (error: any) {
      console.error('Webhook processing error:', error)
      throw error
    }
  }

  /**
   * Verify a payment (used for one-time payments)
   */
  async verifyPayment(params: PaymentVerification): Promise<PaymentResponse> {
    try {
      const { paymentId } = params

      const token = await this.getAccessToken()

      const response = await fetch(`${this.baseUrl}/v1/payments/sale/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data: any = await response.json()

      if (!response.ok) {
        throw new ValidationError('Payment not found')
      }

      return {
        success: data.state === 'completed',
        transactionId: data.id,
        amount: parseFloat(data.amount),
        status: data.state,
      }
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Payment verification failed',
        'PAYPAL_VERIFY_ERROR'
      )
    }
  }

  /**
   * Verify PayPal webhook signature
   * This requires transmitting webhook_id and transmission_id to PayPal for verification
   */
  private async verifyWebhookSignature(payload: WebhookPayload): Promise<boolean> {
    try {
      const token = await this.getAccessToken()

      // In production, you would call PayPal's verification endpoint
      // For now, we'll do basic validation
      return !!payload.signature
    } catch (error) {
      console.error('Webhook signature verification error:', error)
      return false
    }
  }
}
