import { TvmazeError } from './errors'
import { asRecord, normalizeShow } from './normalizeShow'
import type { Show } from './types'

export const searchShows = async (
  query: string,
  signal: AbortSignal,
): Promise<Show[]> => {
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
    url.searchParams.set('q', query.trim())
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new TvmazeError(
        response.status === 429
          ? 'TVmaze получает слишком много запросов. Подождите немного и повторите поиск.'
          : 'TVmaze временно недоступен. Попробуйте ещё раз.',
      )
    }
    const payload: unknown = await response.json()
    controller.signal.throwIfAborted()
    if (!Array.isArray(payload)) {
      throw new TvmazeError(
        'TVmaze вернул некорректные данные. Попробуйте ещё раз.',
      )
    }
    const unique = new Map<number, Show>()
    for (const result of payload) {
      const show = normalizeShow(asRecord(result).show)
      if (!unique.has(show.id)) unique.set(show.id, show)
    }
    return [...unique.values()]
  } catch (error) {
    if (signal.aborted) throw error
    if (timedOut) {
      throw new TvmazeError(
        'Поиск занял слишком много времени. Попробуйте ещё раз.',
      )
    }
    if (error instanceof TvmazeError) throw error
    if (error instanceof SyntaxError) {
      throw new TvmazeError(
        'TVmaze вернул некорректные данные. Попробуйте ещё раз.',
      )
    }
    throw new TvmazeError(
      'Не удалось загрузить шоу. Проверьте соединение и повторите поиск.',
    )
  } finally {
    clearTimeout(timeout)
    signal.removeEventListener('abort', cancel)
  }
}
