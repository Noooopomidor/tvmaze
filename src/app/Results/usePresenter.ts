import type { ResultsProps } from './types'

export const usePresenter = (props: ResultsProps) => {
  return {
    queryLabel: `«${props.query.trim()}»`,
    countLabel: `${props.totalCount} из ${props.totalResults}`,
    hasShows: props.shows.length > 0,
    items: props.shows.map((show, index) => ({
      show,
      index: (props.page - 1) * 3 + index + 1,
    })),
    filterProps: {
      genres: props.genres,
      selectedGenre: props.selectedGenre,
      onGenreChange: props.onGenreChange,
    },
    paginationProps: {
      page: props.page,
      totalPages: props.totalPages,
      totalCount: props.totalCount,
      onPageChange: props.onPageChange,
    },
  }
}
