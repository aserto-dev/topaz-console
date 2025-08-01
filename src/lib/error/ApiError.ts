import { z } from 'zod'

export const ApiErrorResponseSchema = z.object({
  code: z.number(),
  details: z.array(
    z.object({
      '@type': z.string(),
      domain: z.string(),
      metadata: z.record(z.string(), z.unknown()),
      reason: z.string(),
    })
  ),
  message: z.string(),
})

type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>

export class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public type: null | string,
    public reason: null | string,
    public metadata: null | Record<string, unknown>
  ) {
    super(message)
  }

  static fromResponse(response: ApiErrorResponse): ApiError {
    const { code, details, message } = response
    if (details.length > 0) {
      const [{ '@type': type, metadata, reason }] = details
      return new ApiError(message, code, type, reason, metadata)
    }
    return new ApiError(message, code, null, null, null)
  }
}
