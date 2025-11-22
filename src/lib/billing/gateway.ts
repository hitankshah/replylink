/**
 * Billing Gateway Interface and Types
 * Defines the contract for payment gateway implementations
 */

export interface CreateSubscriptionParams {
  planId: string
  customerId: string
  email: string
  quantity?: number
}

export interface CancelSubscriptionParams {
  subscriptionId: string
  reason?: string
}

export interface WebhookPayload {
  type: string
  data: Record<string, any>
  signature?: string
}

export interface PaymentVerification {
  paymentId: string
  signature?: string
}

export interface SubscriptionResponse {
  subscriptionId: string
  paymentUrl: string
  status: 'pending' | 'active' | 'cancelled'
  amount: number
  currency: string
  interval: 'monthly' | 'yearly'
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  amount: number
  status: string
}

/**
 * Main billing gateway interface
 * All payment gateways must implement these methods
 */
export interface IBillingGateway {
  /**
   * Create a new subscription
   * @param params Subscription creation parameters
   * @returns Subscription response with payment URL
   */
  createSubscription(params: CreateSubscriptionParams): Promise<SubscriptionResponse>

  /**
   * Cancel an active subscription
   * @param params Cancellation parameters
   * @returns Cancellation confirmation
   */
  cancelSubscription(params: CancelSubscriptionParams): Promise<PaymentResponse>

  /**
   * Handle incoming webhook from payment gateway
   * @param payload Webhook payload from gateway
   * @returns Webhook processing result
   */
  handleWebhook(payload: WebhookPayload): Promise<{ success: boolean; event: string }>

  /**
   * Verify a payment after transaction
   * @param params Payment verification parameters
   * @returns Verification result
   */
  verifyPayment(params: PaymentVerification): Promise<PaymentResponse>
}

/**
 * Plan pricing configuration
 */
export interface BillingPlan {
  id: string
  name: 'FREE' | 'STARTER' | 'PRO' | 'AGENCY'
  amount: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: {
    pages: number
    accounts: number
    monthlyReplies: number
  }
}

/**
 * Billing error types
 */
export class BillingError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'BillingError'
  }
}

export class GatewayError extends BillingError {
  constructor(message: string, code: string = 'GATEWAY_ERROR') {
    super(code, message, 500)
  }
}

export class ValidationError extends BillingError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400)
  }
}
