import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { PAGE_SIZE } from '../../../store/search/results'
import { selectPagination } from '../../../store/search/selectors'
import { pageChanged } from '../../../store/search/slice'
import { tw } from '../../ui-kit/tw'

export const usePresenter = () => {
  const dispatch = useAppDispatch()
  const { page, totalPages, totalCount } = useAppSelector(selectPagination)
  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, totalCount)

  return {
    isVisible: totalCount > 0,
    rangeLabel: `${start}–${end} из ${totalCount}`,
    previousDisabled: page <= 1,
    nextDisabled: page >= totalPages,
    onPrevious: () => dispatch(pageChanged(page - 1)),
    onNext: () => dispatch(pageChanged(page + 1)),
    pages: Array.from({ length: totalPages }, (_, index) => {
      const number = index + 1
      const isCurrent = number === page

      return {
        number,
        label: `Страница ${number}`,
        current: isCurrent ? ('page' as const) : undefined,
        className: tw(
          isCurrent
            ? 'min-h-9! w-8 border-cyan-200! bg-cyan-300! p-1! text-slate-950! tabular-nums shadow-md shadow-cyan-500/25 sm:min-h-10! sm:w-10 sm:p-2!'
            : 'min-h-9! w-8 border-slate-700! bg-slate-900/70! p-1! text-slate-300! tabular-nums hover:border-fuchsia-400! hover:bg-slate-800! hover:text-fuchsia-300! sm:min-h-10! sm:w-10 sm:p-2!',
        ),
        onClick: () => dispatch(pageChanged(number)),
      }
    }),
  }
}
