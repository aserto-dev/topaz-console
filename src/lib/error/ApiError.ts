import { z } from 'zod'

export const ApiErrorResponseSchema = z.object({
  message: z.string(),
  code: z.number(),
  details: z.array(
    z.object({
      '@type': z.string(),
      domain: z.string(),
      metadata: z.record(z.unknown()),
      reason: z.string(),
    })
  ),
})

type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>

export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public type: string | null,
    public reason: string | null,
    public metadata: Record<string, unknown> | null
  ) {
    super(message)
  }

  static fromResponse(response: ApiErrorResponse): ApiError {
    const { message, code, details } = response
    if (details.length > 0) {
      const [{ '@type': type, metadata, reason }] = details
      return new ApiError(message, code, type, reason, metadata)
    }
    return new ApiError(message, code, null, null, null)
  }
}
