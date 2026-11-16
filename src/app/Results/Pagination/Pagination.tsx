import { Button } from '../../ui-kit/Button/Button'
import { usePresenter } from './logic/usePresenter'

export const Pagination = () => {
  const {
    isVisible,
    rangeLabel,
    previousDisabled,
    nextDisabled,
    onPrevious,
    onNext,
    pages,
  } = usePresenter()

  return (
    <>
      {isVisible && (
        <nav
          className="flex flex-col-reverse items-center justify-between gap-4 border-t border-cyan-300/15 pt-6 sm:flex-row sm:gap-5"
          aria-label="Страницы результатов"
        >
          <p className="m-0 shrink-0 font-mono text-xs text-slate-400 tabular-nums">
            {rangeLabel}
          </p>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              variant="ghost"
              className="px-2! text-xs! sm:px-3! sm:text-sm!"
              disabled={previousDisabled}
              onClick={onPrevious}
            >
              <span aria-hidden="true">←</span> Назад
            </Button>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {pages.map((page) => (
                <Button
                  key={page.number}
                  variant="ghost"
                  className={page.className}
                  aria-label={page.label}
                  aria-current={page.current}
                  onClick={page.onClick}
                >
                  {page.number}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="px-2! text-xs! sm:px-3! sm:text-sm!"
              disabled={nextDisabled}
              onClick={onNext}
            >
              Далее <span aria-hidden="true">→</span>
            </Button>
          </div>
        </nav>
      )}
    </>
  )
}
