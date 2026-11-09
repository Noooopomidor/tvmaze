import { type ChangeEvent, type KeyboardEvent, useId, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectIsLoading, selectQuery } from '../../store/search/selectors'
import { queryChanged } from '../../store/search/slice'

export const usePresenter = () => {
  const dispatch = useAppDispatch()
  const value = useAppSelector(selectQuery)
  const isLoading = useAppSelector(selectIsLoading)
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(queryChanged(event.currentTarget.value))
  }
  const handleClear = () => {
    dispatch(queryChanged(''))
    inputRef.current?.focus()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && value) {
      event.preventDefault()
      handleClear()
    }
  }

  return {
    id,
    inputRef,
    value,
    isLoading,
    showClear: value.length > 0,
    handleChange,
    handleClear,
    handleKeyDown,
  }
}
