import { ApiError, ApiErrorResponseSchema } from './ApiError'

const ensureError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error
  }

  const apiErrorResponseParseResult = ApiErrorResponseSchema.safeParse(error)
  if (apiErrorResponseParseResult.success) {
    return ApiError.fromResponse(apiErrorResponseParseResult.data)
  }

  return new Error(JSON.stringify(error, null, 2))
}

export default ensureError
