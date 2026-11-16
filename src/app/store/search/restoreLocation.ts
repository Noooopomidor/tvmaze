import { normalizePage, prepareResults } from './results'
import type { SearchLocation, SearchState } from './types'

export const restoreLocation = (
  state: SearchState,
  location: SearchLocation,
) => {
  const previousQuery = state.query.trim()
  const query = location.query.trim()
  state.query = query
  state.selectedGenre = location.selectedGenre?.trim() || null
  state.page = normalizePage(location.page)

  if (!query) {
    if (previousQuery) state.requestVersion += 1
    state.selectedGenre = null
    state.page = 1
    state.shows = []
    state.error = null
    state.status = 'idle'
    return
  }

  const sameQuery = query === previousQuery
  if (sameQuery && state.status === 'success') {
    const prepared = prepareResults(
      state.shows,
      state.selectedGenre,
      state.page,
    )
    state.selectedGenre = prepared.selectedGenre
    state.page = prepared.page
    return
  }
  if (sameQuery && state.status === 'loading') return

  state.requestVersion += 1
  state.shows = []
  state.error = null
  state.status = 'loading'
}
