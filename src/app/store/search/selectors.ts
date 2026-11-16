import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { getGenres, prepareResults } from './results'

export const selectQuery = (state: RootState) => state.search.query
export const selectStatus = (state: RootState) => state.search.status
export const selectError = (state: RootState) => state.search.error
export const selectShows = (state: RootState) => state.search.shows
export const selectSelectedGenre = (state: RootState) =>
  state.search.selectedGenre

const selectPage = (state: RootState) => state.search.page

export const selectIsActive = (state: RootState) =>
  selectQuery(state).trim().length > 0
export const selectIsLoading = (state: RootState) =>
  selectStatus(state) === 'loading'
export const selectHasResults = (state: RootState) =>
  selectStatus(state) === 'success' && selectShows(state).length > 0

export const selectFeedbackKind = (
  state: RootState,
): 'loading' | 'empty' | 'error' | null => {
  const status = selectStatus(state)
  if (status === 'loading') return 'loading'
  if (status === 'error') return 'error'
  if (status === 'success' && selectShows(state).length === 0) return 'empty'
  return null
}

export const selectPreparedResults = createSelector(
  [selectShows, selectSelectedGenre, selectPage],
  prepareResults,
)

export const selectGenres = createSelector([selectShows], getGenres)

export const selectPagination = createSelector(
  [selectPreparedResults],
  ({ page, totalPages, totalCount }) => ({ page, totalPages, totalCount }),
)
