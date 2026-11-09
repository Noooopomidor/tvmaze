import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectError,
  selectFeedbackKind,
  selectQuery,
} from '../../store/search/selectors'
import { retryRequested } from '../../store/search/slice'
import { tw } from '../ui-kit/tw'

const skeletonClassName = tw(
  'aspect-2/3 max-h-96 animate-pulse rounded-2xl border border-cyan-900/50 bg-linear-to-br from-slate-900 via-violet-950/40 to-slate-900 motion-reduce:animate-none',
)

const getCopy = (
  kind: ReturnType<typeof selectFeedbackKind>,
  query: string,
  error: string | null,
) => {
  if (kind === 'loading') {
    return {
      title: 'Ищем следующую историю…',
      message: 'Проверяем названия в каталоге TVmaze.',
    }
  }
  if (kind === 'error') {
    return {
      title: 'Небольшая пауза',
      message: error || 'Не удалось получить шоу. Попробуйте ещё раз.',
    }
  }
  return {
    title: 'Пока без совпадений',
    message: `По запросу «${query.trim()}» ничего не нашлось. Попробуйте другое название.`,
  }
}

export const usePresenter = () => {
  const dispatch = useAppDispatch()
  const kind = useAppSelector(selectFeedbackKind)
  const query = useAppSelector(selectQuery)
  const error = useAppSelector(selectError)
  const onRetry = () => dispatch(retryRequested())

  return {
    ...getCopy(kind, query, error),
    isLoading: kind === 'loading',
    isError: kind === 'error',
    onRetry,
    skeletonClassName,
    secondarySkeletonClassName: tw(skeletonClassName, 'hidden md:block'),
    role: kind === 'error' ? ('alert' as const) : ('status' as const),
  }
}
