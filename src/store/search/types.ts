import type { Show } from '../../api/tvmaze/types'

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

export type SearchState = {
  query: string
  selectedGenre: string | null
  page: number
  shows: Show[]
  status: SearchStatus
  error: string | null
  requestVersion: number
}
