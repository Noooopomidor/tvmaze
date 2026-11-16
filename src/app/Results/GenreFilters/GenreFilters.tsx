import { Button } from '../../ui-kit/Button/Button'
import { usePresenter } from './logic/usePresenter'

export const GenreFilters = () => {
  const { options } = usePresenter()

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
