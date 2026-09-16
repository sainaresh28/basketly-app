import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { AppError } from './app-error';

/**
 * Wraps a Next.js Route Handler so every endpoint gets consistent error
 * handling and response shape without repeating try/catch everywhere.
 *
 * Usage:
 *   export const GET = withErrorHandling(async (req) => { ... });
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (req: Request, ...args: Args) => Promise<NextResponse>
) {
  return async (req: Request, ...args: Args): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: err.flatten(),
        },
      },
      { status: 400 }
    );
  }

  if (err instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
        },
      },
      { status: err.statusCode }
    );
  }

  // Unexpected error — log server-side, never leak internals to the client.
  console.error('[unhandled_api_error]', err);
  return NextResponse.json(
    {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again.' },
    },
    { status: 500 }
  );
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
