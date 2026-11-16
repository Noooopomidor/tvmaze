import { useAppSelector } from '../store/hooks'
import {
  selectFeedbackKind,
  selectHasResults,
  selectIsActive,
  selectIsLoading,
} from '../store/search/selectors'

export const usePresenter = () => {
  const isActive = useAppSelector(selectIsActive)
  const isLoading = useAppSelector(selectIsLoading)
  const showResults = useAppSelector(selectHasResults)
  const showFeedback = useAppSelector(selectFeedbackKind) !== null

  return { isActive, isLoading, showResults, showFeedback }
}
