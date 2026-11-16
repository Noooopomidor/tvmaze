import { usePresenter } from './logic/usePresenter'
import type { ButtonProps } from './types'

export const Button = (props: ButtonProps) => {
  const { children, attributes } = usePresenter(props)

  return <button {...attributes}>{children}</button>
}

export type { ButtonProps } from './types'
