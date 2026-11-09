import { Button } from '../ui-kit/Button/Button'
import type { SearchFieldProps } from './types'
import { usePresenter } from './usePresenter'

export const SearchField = (props: SearchFieldProps) => {
  const {
    id,
    inputRef,
    value,
    isLoading,
    showClear,
    handleChange,
    handleClear,
    handleKeyDown,
  } = usePresenter(props)

  return (
    <search className="flex h-16 w-full items-center gap-3 rounded-2xl border border-cyan-400/30 bg-slate-900/80 px-4 shadow-lg shadow-cyan-500/10 transition-shadow duration-150 ease-in-out focus-within:border-cyan-300 focus-within:shadow-cyan-400/30 focus-within:ring-4 focus-within:ring-cyan-400/20 motion-reduce:transition-none sm:h-20 sm:gap-4 sm:px-6">
      <span
        className="relative mr-1 size-5 shrink-0 rounded-full border-2 border-cyan-300"
        aria-hidden="true"
      >
        <span className="absolute -right-1.5 -bottom-1 h-0.5 w-2 rotate-45 rounded-full bg-cyan-300" />
      </span>
      <label className="sr-only" htmlFor={id}>
        Поиск шоу
      </label>
      <input
        ref={inputRef}
        id={id}
        className="w-full min-w-0 flex-1 appearance-none border-0 bg-transparent py-2 text-base leading-normal text-slate-100 caret-fuchsia-400 outline-none placeholder:text-slate-400 focus-visible:outline-none sm:text-lg"
        type="text"
        inputMode="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Какое шоу ищем?"
        autoComplete="off"
        spellCheck={false}
      />
      <div className="flex h-10 w-16 shrink-0 items-center justify-end gap-2">
        {isLoading && (
          <span
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-cyan-400/20 border-t-fuchsia-400 motion-reduce:animate-none"
            aria-hidden="true"
          />
        )}
        {showClear && (
          <Button
            variant="ghost"
            className="h-10 w-10 shrink-0 p-1! text-2xl! leading-none! font-light! text-cyan-300! hover:text-fuchsia-300!"
            aria-label="Очистить поиск"
            onClick={handleClear}
          >
            <span aria-hidden="true">×</span>
          </Button>
        )}
      </div>
    </search>
  )
}
