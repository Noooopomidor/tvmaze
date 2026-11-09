import { tw } from '../tw'
import type { ButtonProps } from './types'

const baseClasses = tw(
  'inline-flex items-center justify-center gap-2 rounded-full border cursor-pointer leading-tight transition duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-cyan-300 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-35 motion-reduce:transition-none',
)

const variantClasses = {
  solid: tw(
    'min-h-10 border-fuchsia-400/60 bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 enabled:hover:border-fuchsia-300 enabled:hover:bg-fuchsia-700 enabled:hover:shadow-fuchsia-400/40',
  ),
  ghost: tw(
    'min-h-10 border-transparent bg-slate-900/70 px-4 py-2 text-sm font-semibold text-cyan-300 enabled:hover:border-cyan-400/40 enabled:hover:bg-cyan-950/80 enabled:hover:text-cyan-100',
  ),
  chip: tw(
    'min-h-9 border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-cyan-200 enabled:hover:border-cyan-400/60 enabled:hover:bg-cyan-950 enabled:hover:text-cyan-100 aria-pressed:border-fuchsia-400 aria-pressed:bg-fuchsia-600 aria-pressed:text-white aria-pressed:shadow-md aria-pressed:shadow-fuchsia-500/30 aria-pressed:enabled:hover:border-fuchsia-300 aria-pressed:enabled:hover:bg-fuchsia-700 aria-pressed:enabled:hover:text-white',
  ),
}

export const Button = (props: ButtonProps) => {
  const {
    children,
    variant = 'solid',
    className = '',
    type = 'button',
    ...rest
  } = props

  return (
    <button
      {...rest}
      type={type}
      className={tw(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  )
}

export type { ButtonProps } from './types'
