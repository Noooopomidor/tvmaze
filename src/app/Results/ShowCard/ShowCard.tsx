import { usePresenter } from './logic/usePresenter'
import type { ShowCardProps } from './types'

export const ShowCard = (props: ShowCardProps) => {
  const {
    name,
    url,
    image,
    imageAlt,
    hasImage,
    onImageError,
    initial,
    number,
    hasRating,
    rating,
    metadata,
    genres,
    summary,
    linkLabel,
  } = usePresenter(props)

  return (
    <article className="h-full rounded-3xl border border-slate-800 bg-slate-900/70 p-3 shadow-lg shadow-slate-950/50 transition duration-300 hover:border-fuchsia-400/50 hover:shadow-xl hover:shadow-fuchsia-500/20 focus-within:border-cyan-300/60 focus-within:shadow-cyan-500/20 motion-reduce:transition-none">
      <a
        className="group relative isolate block aspect-2/3 overflow-hidden rounded-2xl border border-cyan-300/15 bg-slate-950 text-inherit no-underline shadow-md shadow-cyan-500/10 transition-colors hover:border-cyan-300/50 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-cyan-300 focus-visible:outline-offset-4 motion-reduce:transition-none"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkLabel}
      >
        {hasImage ? (
          <img
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            src={image}
            alt={imageAlt}
            loading="lazy"
            onError={onImageError}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-linear-to-br from-violet-950 via-slate-900 to-slate-950 text-cyan-300">
            <span
              className="font-mono text-8xl font-semibold leading-none tracking-tighter drop-shadow-lg drop-shadow-cyan-400/50 lg:text-9xl"
              aria-hidden="true"
            >
              {initial}
            </span>
            <span className="font-mono text-xs tracking-widest text-cyan-200/70 uppercase">
              Нет постера
            </span>
          </div>
        )}
        <span
          className="pointer-events-none absolute inset-x-0 top-1/2 bottom-0 z-0 bg-linear-to-b from-transparent to-slate-950/40"
          aria-hidden="true"
        />
        <span className="absolute top-3 left-3 z-10 inline-flex min-h-8 items-center justify-center rounded-lg border border-cyan-300/20 bg-slate-950/85 px-2.5 py-2 font-mono text-xs font-semibold leading-none text-cyan-200 tabular-nums backdrop-blur-sm">
          {number}
        </span>
        {hasRating && (
          <span className="absolute top-3 right-3 z-10 inline-flex min-h-8 items-center justify-center gap-1 rounded-lg border border-cyan-300/20 bg-slate-950/85 px-2.5 py-2 font-mono text-xs font-semibold leading-none text-cyan-200 tabular-nums backdrop-blur-sm">
            <span className="text-fuchsia-400" aria-hidden="true">
              ★
            </span>{' '}
            {rating}
          </span>
        )}
      </a>
      <div className="px-2 pt-5 pb-3">
        <p className="m-0 mb-2 font-mono text-xs leading-normal tracking-wide text-slate-400">
          {metadata}
        </p>
        <h3 className="m-0 mb-2 text-2xl font-semibold leading-tight tracking-tight text-white wrap-anywhere lg:text-3xl">
          <a
            className="text-inherit no-underline transition-colors hover:text-cyan-300 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-cyan-300 focus-visible:outline-offset-4 motion-reduce:transition-none"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </h3>
        <p className="m-0 mb-3 min-h-4 font-mono text-xs font-medium leading-relaxed tracking-wide text-fuchsia-300 uppercase">
          {genres}
        </p>
        <p className="m-0 line-clamp-3 min-h-16 text-xs leading-relaxed text-slate-400">
          {summary}
        </p>
        <a
          className="mt-5 inline-flex items-center justify-between gap-6 border-b border-cyan-300/40 py-2 font-mono text-xs font-semibold text-cyan-300 no-underline transition-colors hover:border-fuchsia-400 hover:text-fuchsia-300 focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-cyan-300 focus-visible:outline-offset-4 motion-reduce:transition-none"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={linkLabel}
        >
          О шоу{' '}
          <span className="text-lg text-fuchsia-400" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </article>
  )
}
