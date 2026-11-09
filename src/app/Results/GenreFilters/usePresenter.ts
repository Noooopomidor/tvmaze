import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  selectGenres,
  selectSelectedGenre,
} from '../../../store/search/selectors'
import { genreChanged } from '../../../store/search/slice'

export const usePresenter = () => {
  const dispatch = useAppDispatch()
  const genres = useAppSelector(selectGenres)
  const selectedGenre = useAppSelector(selectSelectedGenre)
  const options = [null, ...genres]

  return {
    options: options.map((genre) => ({
      id: genre ?? 'all',
      label: genre ?? 'Все жанры',
      isSelected: genre === selectedGenre,
      onClick: () =>
        dispatch(genreChanged(genre === selectedGenre ? null : genre)),
    })),
  }
}
