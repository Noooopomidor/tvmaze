import { useAppDispatch, useAppSelector } from '../store/hooks'
import { prepareResults } from '../store/search/results'
import {
  genreChanged,
  pageChanged,
  queryChanged,
  retryRequested,
} from '../store/search/slice'
import type { SearchStatus } from '../store/search/types'

const getFeedback = (
  status: SearchStatus,
  query: string,
  error: string | null,
  total: number,
) => {
  if (status === 'loading') {
    return { kind: 'loading' as const, query, error: null }
  }
  if (status === 'error') {
    return { kind: 'error' as const, query, error }
  }
  if (status === 'success' && total === 0) {
    return { kind: 'empty' as const, query, error: null }
  }
  return null
}

export const usePresenter = () => {
  const dispatch = useAppDispatch()
  const { query, selectedGenre, page, shows, status, error } = useAppSelector(
    (state) => state.search,
  )
  const isActive = query.trim().length > 0
  const isLoading = status === 'loading'
  const prepared = prepareResults(shows, selectedGenre, page)

  const handleQueryChange = (value: string) => {
    dispatch(queryChanged(value))
  }

  const handleGenreChange = (genre: string | null) => {
    dispatch(genreChanged(genre))
  }

  const handlePageChange = (nextPage: number) => {
    dispatch(pageChanged(Math.max(1, Math.min(nextPage, prepared.totalPages))))
  }

  const retry = () => dispatch(retryRequested())

  return {
    isActive,
    query,
    isLoading,
    showResults: status === 'success' && shows.length > 0,
    feedback: getFeedback(status, query, error, shows.length),
    results: {
      ...prepared,
      selectedGenre,
      onGenreChange: handleGenreChange,
      onPageChange: handlePageChange,
      query: query.trim(),
    },
    handleQueryChange,
    retry,
  }
}
