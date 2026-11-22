import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost'

/** Class names, for a link or label that has to look like a button. */
export function buttonClass(variant: Variant = 'ghost', small = false): string {
  return `kit-btn ${variant === 'primary' ? 'kit-btn-primary' : 'kit-btn-ghost'}${small ? ' kit-btn-small' : ''}`
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary is the one amber action on the page; ghost is everything else. */
  variant?: Variant
  small?: boolean
}

export function Button({
  variant = 'ghost',
  small = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const base = buttonClass(variant, small)
  return <button type={type} className={className ? `${base} ${className}` : base} {...rest} />
}
