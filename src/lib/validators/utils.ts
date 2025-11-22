import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

/**
 * Validate request body against a Zod schema
 * Returns validated data or error response
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    return { success: true, data: validated as T }
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: messages,
          },
          { status: 400 }
        ),
      }
    }

    return {
      success: false,
      error: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    }
  }
}

/**
 * Format validation error for client display
 */
export function formatValidationError(error: ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}

  error.errors.forEach((err) => {
    const field = err.path.join('.')
    formatted[field] = err.message
  })

  return formatted
}
