import { GenreFilters } from './GenreFilters/GenreFilters'
import { usePresenter } from './logic/usePresenter'
import { Pagination } from './Pagination/Pagination'
import { ShowCard } from './ShowCard/ShowCard'

export const Results = () => {
  const { queryLabel, countLabel, hasShows, items } = usePresenter()

  return (
    <section className="w-full" aria-label="Результаты поиска">
      <p className="m-0 mb-3 font-mono text-xs leading-4 font-semibold tracking-widest text-fuchsia-400">
        РЕЗУЛЬТАТЫ ПОИСКА
      </p>
      <div className="mb-7 flex items-start justify-between gap-4 md:gap-6">
        <h2 className="m-0 text-3xl leading-tight font-semibold tracking-tighter text-white wrap-anywhere sm:text-5xl">
          {queryLabel}
        </h2>
        <p
          className="m-0 flex shrink-0 flex-col gap-1 rounded-xl border border-cyan-300/15 bg-slate-900/70 px-3 py-2 text-right shadow-lg shadow-cyan-500/5 sm:px-4 sm:py-3"
          aria-live="polite"
        >
          <strong className="font-mono text-lg font-medium tracking-tight text-cyan-300 md:text-xl">
            {countLabel}
          </strong>
          <span className="text-xs text-slate-400">шоу в подборке</span>
        </p>
      </div>
      <GenreFilters />
      {hasShows ? (
        <ul className="mt-8 mb-10 grid list-none grid-cols-1 gap-9 p-0 md:grid-cols-3 md:gap-5 lg:gap-8">
          {items.map((item) => (
            <li key={item.show.id} className="min-w-0">
              <ShowCard show={item.show} index={item.index} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="my-4 rounded-2xl border border-white/10 bg-slate-900/50 px-6 py-20 text-center text-slate-400">
          В этом жанре пока ничего нет. Попробуйте другой.
        </p>
      )}
      <Pagination />
    </section>
  )
}
