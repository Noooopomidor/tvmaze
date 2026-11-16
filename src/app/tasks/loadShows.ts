import { fetchSearchResults } from '../services/api/tvmaze/fetchSearchResults'
import { asRecord, normalizeShow } from '../services/api/tvmaze/normalizeShow'
import type { Show } from '../services/api/tvmaze/types'

export const loadShows = async (
  query: string,
  signal: AbortSignal,
): Promise<Show[]> => {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []
  signal.throwIfAborted()

  const results = await fetchSearchResults(normalizedQuery, signal)
  signal.throwIfAborted()
  const unique = new Map<number, Show>()
  for (const result of results) {
    const show = normalizeShow(asRecord(result).show)
    if (!unique.has(show.id)) unique.set(show.id, show)
  }
  return [...unique.values()]
}
