import { Button } from '../../ui-kit/Button/Button'
import type { GenreFiltersProps } from './types'
import { usePresenter } from './usePresenter'

export const GenreFilters = (props: GenreFiltersProps) => {
  const { options } = usePresenter(props)

  return (
    <fieldset
      className="m-0 flex min-w-0 flex-wrap gap-2 border-0 border-b border-white/10 p-0 pb-7"
      aria-label="Фильтр по жанрам"
    >
      {options.map((option) => (
        <Button
          key={option.id}
          variant="chip"
          aria-pressed={option.isSelected}
          onClick={option.onClick}
        >
          {option.label}
        </Button>
      ))}
    </fieldset>
  )
}
