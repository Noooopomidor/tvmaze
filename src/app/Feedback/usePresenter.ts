import { tw } from '../ui-kit/tw'
import type { FeedbackProps } from './types'

const skeletonClassName = tw(
  'aspect-2/3 max-h-96 animate-pulse rounded-2xl border border-cyan-900/50 bg-linear-to-br from-slate-900 via-violet-950/40 to-slate-900 motion-reduce:animate-none',
)

const getCopy = (props: FeedbackProps) => {
  if (props.kind === 'loading') {
    return {
      title: 'Ищем следующую историю…',
      message: 'Проверяем названия в каталоге TVmaze.',
    }
  }
  if (props.kind === 'error') {
    return {
      title: 'Небольшая пауза',
      message: props.error || 'Не удалось получить шоу. Попробуйте ещё раз.',
    }
  }
  return {
    title: 'Пока без совпадений',
    message: `По запросу «${props.query.trim()}» ничего не нашлось. Попробуйте другое название.`,
  }
}

export const usePresenter = (props: FeedbackProps) => ({
  ...getCopy(props),
  isLoading: props.kind === 'loading',
  isError: props.kind === 'error',
  onRetry: props.onRetry,
  skeletonClassName,
  secondarySkeletonClassName: tw(skeletonClassName, 'hidden md:block'),
  role: props.kind === 'error' ? ('alert' as const) : ('status' as const),
})
