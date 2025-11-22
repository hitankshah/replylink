import { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogContext {
  requestId?: string
  userId?: string
  method?: string
  url?: string
  statusCode?: number
  duration?: number
  error?: Error
}

class Logger {
  private level: LogLevel = LogLevel.INFO

  constructor() {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase()
    if (envLevel && Object.values(LogLevel).includes(envLevel as LogLevel)) {
      this.level = envLevel as LogLevel
    }
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level}] ${message}${contextStr}`
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    return levels.indexOf(level) >= levels.indexOf(this.level)
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message, context))
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context))
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = {
        ...context,
        error: context?.error ? context.error.message : undefined,
        stack: context?.error ? context.error.stack : undefined,
      }
      console.error(this.formatMessage(LogLevel.ERROR, message, errorContext))
    }
  }
}

export const logger = new Logger()

export function generateRequestId(): string {
  return uuidv4()
}

export function createRequestLogger(request: NextRequest) {
  const requestId = generateRequestId()
  const startTime = Date.now()

  return {
    requestId,
    debug: (message: string, extra?: Record<string, any>) =>
      logger.debug(message, {
        requestId,
        method: request.method,
        url: request.nextUrl.pathname,
        ...extra,
      }),
    info: (message: string, extra?: Record<string, any>) =>
      logger.info(message, {
        requestId,
        method: request.method,
        url: request.nextUrl.pathname,
        ...extra,
      }),
    warn: (message: string, extra?: Record<string, any>) =>
      logger.warn(message, {
        requestId,
        method: request.method,
        url: request.nextUrl.pathname,
        ...extra,
      }),
    error: (message: string, error?: Error, extra?: Record<string, any>) =>
      logger.error(message, {
        requestId,
        method: request.method,
        url: request.nextUrl.pathname,
        error,
        ...extra,
      }),
    logResponse: (statusCode: number, userId?: string) => {
      const duration = Date.now() - startTime
      const level = statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO
      const message = `${request.method} ${request.nextUrl.pathname} - ${statusCode}`

      if (level === LogLevel.WARN) {
        logger.warn(message, {
          requestId,
          statusCode,
          duration,
          userId,
        })
      } else {
        logger.info(message, {
          requestId,
          statusCode,
          duration,
          userId,
        })
      }
    },
  }
}
