import { createTvmazeError, isTvmazeError } from './errors'

export const fetchSearchResults = async (
  query: string,
  signal: AbortSignal,
): Promise<unknown[]> => {
  const controller = new AbortController()
  let timedOut = false
  const cancel = () => controller.abort()
  signal.addEventListener('abort', cancel, { once: true })
  if (signal.aborted) cancel()
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, 12_000)

  try {
    const url = new URL('https://api.tvmaze.com/search/shows')
    url.searchParams.set('q', query)
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw createTvmazeError(
        response.status === 429 ? 'rate-limit' : 'http',
        response.status,
      )
    }
    const payload: unknown = await response.json()
    controller.signal.throwIfAborted()
    if (!Array.isArray(payload)) {
      throw createTvmazeError('invalid-response')
    }
    return payload
  } catch (error) {
    if (signal.aborted) throw error
    if (timedOut) {
      throw createTvmazeError('timeout')
    }
    if (isTvmazeError(error)) throw error
    if (error instanceof SyntaxError) {
      throw createTvmazeError('invalid-response')
    }
    throw createTvmazeError('network')
  } finally {
    clearTimeout(timeout)
    signal.removeEventListener('abort', cancel)
  }
}
