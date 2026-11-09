import { type ChangeEvent, type KeyboardEvent, useId, useRef } from 'react'
import type { SearchFieldProps } from './types'

export const usePresenter = (props: SearchFieldProps) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onValueChange(event.currentTarget.value)
  }
  const handleClear = () => {
    props.onValueChange('')
    inputRef.current?.focus()
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && props.value) {
      event.preventDefault()
      handleClear()
    }
  }

  return {
    id,
    inputRef,
    value: props.value,
    isLoading: props.isLoading,
    showClear: props.value.length > 0,
    handleChange,
    handleClear,
    handleKeyDown,
  }
}
