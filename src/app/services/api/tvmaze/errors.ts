const errorCodes = [
  'rate-limit',
  'http',
  'timeout',
  'network',
  'invalid-response',
] as const

export type TvmazeErrorCode = (typeof errorCodes)[number]
export type TvmazeError = Error & {
  code: TvmazeErrorCode
  status?: number
}

export const createTvmazeError = (
  code: TvmazeErrorCode,
  status?: number,
): TvmazeError => {
  return Object.assign(new Error(`TVmaze request failed: ${code}`), {
    name: 'TvmazeError',
    code,
    status,
  })
}

export const isTvmazeError = (error: unknown): error is TvmazeError => {
  return (
    error instanceof Error &&
    error.name === 'TvmazeError' &&
    'code' in error &&
    errorCodes.some((code) => code === error.code)
  )
}
