import type { TvmazeErrorCode } from '../../services/api/tvmaze/errors'
import type { Show } from '../../services/api/tvmaze/types'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'
export type SearchErrorCode = TvmazeErrorCode

export type SearchState = {
  query: string
  selectedGenre: string | null
  page: number
  shows: Show[]
  status: SearchStatus
  error: SearchErrorCode | null
  requestVersion: number
}

export type SearchLocation = Pick<
  SearchState,
  'query' | 'selectedGenre' | 'page'
>
