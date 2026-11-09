import { tw } from '../../ui-kit/tw'
import type { PaginationProps } from './types'

export const usePresenter = (props: PaginationProps) => {
  const start = (props.page - 1) * 3 + 1
  const end = Math.min(props.page * 3, props.totalCount)

  return {
    isVisible: props.totalCount > 0,
    rangeLabel: `${start}–${end} из ${props.totalCount}`,
    previousDisabled: props.page <= 1,
    nextDisabled: props.page >= props.totalPages,
    onPrevious: () => props.onPageChange(props.page - 1),
    onNext: () => props.onPageChange(props.page + 1),
    pages: Array.from({ length: props.totalPages }, (_, index) => {
      const number = index + 1
      const isCurrent = number === props.page

      return {
        number,
        label: `Страница ${number}`,
        current: isCurrent ? ('page' as const) : undefined,
        className: tw(
          isCurrent
            ? 'min-h-9! w-8 border-cyan-200! bg-cyan-300! p-1! text-slate-950! tabular-nums shadow-md shadow-cyan-500/25 sm:min-h-10! sm:w-10 sm:p-2!'
            : 'min-h-9! w-8 border-slate-700! bg-slate-900/70! p-1! text-slate-300! tabular-nums hover:border-fuchsia-400! hover:bg-slate-800! hover:text-fuchsia-300! sm:min-h-10! sm:w-10 sm:p-2!',
        ),
        onClick: () => props.onPageChange(number),
      }
    }),
  }
}
