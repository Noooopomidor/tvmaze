import { Feedback } from './Feedback/Feedback'
import { Results } from './Results/Results'
import { SearchField } from './SearchField/SearchField'
import { usePresenter } from './usePresenter'

const App = () => {
  const { isActive, isLoading, showResults, showFeedback } = usePresenter()

  return (
    <div className="relative isolate mx-auto flex min-h-svh w-full max-w-7xl flex-col px-5 pt-8 sm:px-12 sm:pt-12">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 h-96 bg-linear-to-b from-violet-950/40 to-transparent" />
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="absolute top-48 -right-32 size-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 size-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>
      <header className="shrink-0">
        <div className="mb-8 flex items-center gap-4 sm:mb-10">
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-2xl text-cyan-300 shadow-lg shadow-cyan-500/20"
            aria-hidden="true"
          >
            ◈
          </span>
          <h1 className="text-4xl leading-none font-black tracking-tighter drop-shadow-lg drop-shadow-fuchsia-500/30 sm:text-6xl">
            <span className="bg-linear-to-r from-cyan-200 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">
              showroom
            </span>
            <span className="text-fuchsia-400">.</span>
          </h1>
        </div>
        <SearchField />
      </header>
      {isActive && (
        <main className="flex-1 py-8 sm:py-10" aria-busy={isLoading}>
          {showFeedback && <Feedback />}
          {showResults && <Results />}
        </main>
      )}
      {isActive && (
        <footer className="flex flex-col justify-between gap-4 border-t border-cyan-900/50 py-6 font-mono text-xs text-slate-400 sm:flex-row">
          <span>Хорошие истории ближе, чем кажется.</span>
          <a
            className="text-cyan-300 underline decoration-cyan-800 underline-offset-4 transition-colors hover:text-fuchsia-300"
            href="https://www.tvmaze.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Данные и постеры — TVmaze ↗
          </a>
        </footer>
      )}
    </div>
  )
}

export default App
