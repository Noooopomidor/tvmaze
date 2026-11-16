import { useAppSelector } from '../../store/hooks'
import { PAGE_SIZE } from '../../store/search/results'
import {
  selectPreparedResults,
  selectQuery,
} from '../../store/search/selectors'

export const usePresenter = () => {
  const query = useAppSelector(selectQuery)
  const { shows, page, totalCount, totalResults } = useAppSelector(
    selectPreparedResults,
  )

  return {
    queryLabel: `«${query.trim()}»`,
    countLabel: `${totalCount} из ${totalResults}`,
    hasShows: shows.length > 0,
    items: shows.map((show, index) => ({
      show,
      index: (page - 1) * PAGE_SIZE + index + 1,
    })),
  }
}
