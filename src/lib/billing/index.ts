/**
 * Billing Gateway Factory
 * Creates and caches gateway instances
 */

import { IBillingGateway } from './gateway'
import { RazorpayGateway } from './razorpay'
import { PayPalGateway } from './paypal'

type GatewayType = 'razorpay' | 'paypal'

// Gateway cache
const gatewayCache = new Map<GatewayType, IBillingGateway>()

/**
 * Get a billing gateway instance
 * Instances are cached to avoid recreating them
 *
 * @param gateway - Gateway type ('razorpay' or 'paypal')
 * @returns IBillingGateway instance
 * @throws Error if gateway type is invalid or credentials are missing
 */
export function getBillingGateway(gateway: GatewayType): IBillingGateway {
  // Return cached instance if available
  if (gatewayCache.has(gateway)) {
    return gatewayCache.get(gateway)!
  }

  // Create new instance based on gateway type
  let instance: IBillingGateway

  switch (gateway) {
    case 'razorpay':
      instance = new RazorpayGateway()
      break

    case 'paypal':
      instance = new PayPalGateway()
      break

    default:
      throw new Error(`Unknown gateway: ${gateway}`)
  }

  // Cache the instance
  gatewayCache.set(gateway, instance)

  return instance
}

/**
 * Clear gateway cache (useful for testing or credential rotation)
 */
export function clearGatewayCache(): void {
  gatewayCache.clear()
}

/**
 * Export all billing components
 */
export * from './gateway'
