/**
 * Razorpay Payment Gateway Implementation
 */

import Razorpay from 'razorpay'
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

export class RazorpayGateway implements IBillingGateway {
  private razorpay: Razorpay

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured')
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  }

  /**
   * Create a subscription on Razorpay
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResponse> {
    try {
      const { planId, customerId, email, quantity = 1 } = params

      // Create or get customer
      const customer = await this.razorpay.customers.create({
        email,
        contact: customerId,
      })

      // Create subscription
      const subscription = await this.razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        quantity,
        total_count: 12, // 12 months subscription
        addons: [
          {
            item: {
              name: 'Setup charges',
              amount: 0,
            },
          },
        ],
      })

      if (!subscription.short_url) {
        throw new GatewayError('Failed to generate payment URL')
      }

      return {
        subscriptionId: subscription.id,
        paymentUrl: subscription.short_url,
        status: 'pending',
        amount: subscription.plan_id ? 0 : 0, // Amount from plan
        currency: 'INR',
        interval: 'monthly',
      }
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Failed to create subscription',
        'RAZORPAY_CREATE_ERROR'
      )
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(params: CancelSubscriptionParams): Promise<PaymentResponse> {
    try {
      const { subscriptionId, reason = 'Cancelled by user' } = params

      const result = await this.razorpay.subscriptions.cancel(subscriptionId, {
        notify_customer: 1,
        cancellation_reason: reason,
      })

      return {
        success: true,
        transactionId: result.id,
        amount: 0,
        status: 'cancelled',
      }
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Failed to cancel subscription',
        'RAZORPAY_CANCEL_ERROR'
      )
    }
  }

  /**
   * Verify webhook signature and process event
   */
  async handleWebhook(payload: WebhookPayload): Promise<{ success: boolean; event: string }> {
    try {
      const { signature, data } = payload

      if (!signature) {
        throw new ValidationError('Webhook signature missing')
      }

      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(JSON.stringify(data), signature)
      if (!isValid) {
        throw new ValidationError('Invalid webhook signature')
      }

      const event = data.event
      const eventData = data.payload

      // Handle different webhook events
      switch (event) {
        case 'subscription.authenticated':
          return { success: true, event: 'subscription.authenticated' }

        case 'subscription.activated':
          return { success: true, event: 'subscription.activated' }

        case 'subscription.cancelled':
          return { success: true, event: 'subscription.cancelled' }

        case 'subscription.updated':
          return { success: true, event: 'subscription.updated' }

        default:
          console.warn(`Unknown Razorpay webhook event: ${event}`)
          return { success: true, event }
      }
    } catch (error: any) {
      console.error('Webhook processing error:', error)
      throw error
    }
  }

  /**
   * Verify a payment
   */
  async verifyPayment(params: PaymentVerification): Promise<PaymentResponse> {
    try {
      const { paymentId, signature } = params

      if (!signature) {
        throw new ValidationError('Payment signature missing')
      }

      const payment = await this.razorpay.payments.fetch(paymentId)

      if (!payment) {
        throw new ValidationError('Payment not found')
      }

      // Verify payment signature
      const isValid = this.verifyPaymentSignature(paymentId, signature)
      if (!isValid) {
        throw new ValidationError('Invalid payment signature')
      }

      return {
        success: payment.status === 'captured',
        transactionId: payment.id,
        amount: payment.amount / 100, // Convert from paise to rupees
        status: payment.status,
      }
    } catch (error: any) {
      throw new GatewayError(
        error.message || 'Payment verification failed',
        'RAZORPAY_VERIFY_ERROR'
      )
    }
  }

  /**
   * Verify webhook signature using HMAC-SHA256
   */
  private verifyWebhookSignature(payload: string, signature: string): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) return false

    const hash = crypto.createHmac('sha256', keySecret).update(payload).digest('hex')
    return hash === signature
  }

  /**
   * Verify payment signature
   * This is a simplified version - actual implementation may vary
   */
  private verifyPaymentSignature(paymentId: string, signature: string): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) return false

    const hash = crypto.createHmac('sha256', keySecret).update(paymentId).digest('hex')
    return hash === signature
  }
}
