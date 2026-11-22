import type { ButtonHTMLAttributes } from 'react'

/** Class strings, for apps that need a link or label styled like a button. */
export const buttonClass =
  'rounded-md border border-app-border px-4 py-2 text-sm font-medium hover:bg-app-surface disabled:cursor-not-allowed disabled:opacity-50'
export const primaryButtonClass =
  'rounded-md bg-app-accent px-5 py-2 text-sm font-semibold text-app-accent-contrast hover:opacity-90'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({
  variant = 'secondary',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const base = variant === 'primary' ? primaryButtonClass : buttonClass
  return <button type={type} className={className ? `${base} ${className}` : base} {...rest} />
}
