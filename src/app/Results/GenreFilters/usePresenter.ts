import type { GenreFiltersProps } from './types'

export const usePresenter = (props: GenreFiltersProps) => {
  const genres = [null, ...props.genres]

  return {
    options: genres.map((genre) => ({
      id: genre ?? 'all',
      label: genre ?? 'Все жанры',
      isSelected: genre === props.selectedGenre,
      onClick: () =>
        props.onGenreChange(genre === props.selectedGenre ? null : genre),
    })),
  }
}
