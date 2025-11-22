import * as Sentry from '@sentry/nextjs'

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Requires SENTRY_DSN environment variable
 */
export function initSentry() {
  const dsn = process.env.SENTRY_DSN

  if (!dsn) {
    console.warn('Sentry DSN not configured. Error tracking disabled.')
    return
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event, hint) {
      // Filter out expected errors
      if (hint.originalException instanceof Error) {
        const message = hint.originalException.message

        // Ignore specific errors that are expected
        if (
          message.includes('ECONNREFUSED') ||
          message.includes('Network request failed')
        ) {
          return null
        }
      }

      return event
    },
    ignoreErrors: [
      // Browser extensions
      'chrome-extension://',
      'moz-extension://',
      // Network errors (already handled)
      'NetworkError',
      'Network request failed',
    ],
  })
}

/**
 * Capture exception with context
 * @param error - The error to capture
 * @param context - Additional context information
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.captureException(error, {
      contexts: {
        app: context,
      },
    })
  } else {
    Sentry.captureException(error)
  }
}

/**
 * Capture message for informational logging
 * @param message - The message to capture
 * @param level - Log level (default: 'info')
 * @param context - Additional context
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: Record<string, any>
) {
  if (context) {
    Sentry.captureMessage(message, {
      level,
      contexts: {
        app: context,
      },
    })
  } else {
    Sentry.captureMessage(message, level)
  }
}

/**
 * Set user context for Sentry
 * @param userId - The user ID
 * @param email - User email (optional)
 * @param other - Other user properties (optional)
 */
export function setUserContext(
  userId: string,
  email?: string,
  other?: Record<string, any>
) {
  Sentry.setUser({
    id: userId,
    email,
    ...other,
  })
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUserContext() {
  Sentry.setUser(null)
}

/**
 * Add breadcrumb for debugging
 * @param message - Breadcrumb message
 * @param data - Additional data
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    data,
    timestamp: Date.now() / 1000,
  })
}

/**
 * Start a performance transaction
 * @param name - Transaction name
 */
export function startTransaction(name: string) {
  return Sentry.startTransaction({
    name,
    op: 'http.request',
  })
}
