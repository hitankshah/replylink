import { initSentry } from '@/lib/sentry'

/**
 * Initialize Sentry on application startup
 * This should be called as early as possible in the application lifecycle
 */
export function initErrorTracking() {
  if (typeof window === 'undefined') {
    // Server-side initialization
    initSentry()
  }
}
