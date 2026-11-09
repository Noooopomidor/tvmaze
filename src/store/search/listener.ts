import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { searchShows } from '../../api/tvmaze/searchShows'
import {
  queryChanged,
  requestFailed,
  requestSucceeded,
  retryRequested,
} from './slice'
import type { SearchState } from './types'

export const searchListenerMiddleware = createListenerMiddleware<{
  search: SearchState
}>()

searchListenerMiddleware.startListening({
  matcher: isAnyOf(queryChanged, retryRequested),
  effect: async (action, listener) => {
    const previous = listener.getOriginalState().search
    const current = listener.getState().search
    const query = current.query.trim()
    if (queryChanged.match(action) && query === previous.query.trim()) return

    listener.cancelActiveListeners()
    if (!query) return
    const { requestVersion } = current

    try {
      await listener.delay(350)
      const shows = await searchShows(query, listener.signal)
      listener.throwIfCancelled()
      listener.dispatch(requestSucceeded({ requestVersion, shows }))
    } catch (error) {
      if (listener.signal.aborted) return
      listener.dispatch(
        requestFailed({
          requestVersion,
          error:
            error instanceof Error
              ? error.message
              : 'Не удалось загрузить шоу.',
        }),
      )
    }
  },
})
