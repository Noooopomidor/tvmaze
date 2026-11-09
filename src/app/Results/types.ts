import type { Show } from '../../api/tvmaze/types'

export interface ResultsProps {
  shows: Show[]
  genres: string[]
  selectedGenre: string | null
  onGenreChange: (genre: string | null) => void
  page: number
  totalPages: number
  totalCount: number
  totalResults: number
  onPageChange: (page: number) => void
  query: string
}
