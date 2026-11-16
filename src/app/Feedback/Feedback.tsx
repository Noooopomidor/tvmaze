import { Button } from '../ui-kit/Button/Button'
import { usePresenter } from './logic/usePresenter'

export const Feedback = () => {
  const {
    title,
    message,
    isLoading,
    isError,
    onRetry,
    role,
    skeletonClassName,
    secondarySkeletonClassName,
  } = usePresenter()

  return (
    <section role={role} aria-live="polite">
      <div className="pb-8">
        <p className="m-0 mb-3 font-mono text-xs leading-4 font-semibold tracking-widest text-cyan-300">
          SHOWROOM / ПОИСК
        </p>
        <h2 className="mt-0 mb-3 text-3xl leading-tight font-semibold tracking-tighter text-white sm:text-5xl">
          {title}
        </h2>
        <p className="mb-6 max-w-xl leading-relaxed text-slate-400">
          {message}
        </p>
        {isError && <Button onClick={onRetry}>Попробовать снова ↗</Button>}
      </div>
      {isLoading && (
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          aria-hidden="true"
        >
          <div className={skeletonClassName} />
          <div className={secondarySkeletonClassName} />
          <div className={secondarySkeletonClassName} />
        </div>
      )}
    </section>
  )
}
