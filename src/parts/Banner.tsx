import type { ReactNode } from 'react'

type ErrorBannerProps = {
  /** What is wrong, in plain words. */
  error: string
  /** What to do about it. */
  hint?: string
  /** The technical detail, last and muted. */
  detail?: string
  children?: ReactNode
}

/** Full-width error banner. Put it directly above the panes, never inside one. */
export function ErrorBanner({ error, hint, detail, children }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-xl border border-red-700 bg-app-surface px-4 py-3"
    >
      <p className="font-semibold text-red-700 dark:text-red-400">{error}</p>
      {hint && <p>{hint}</p>}
      {detail && <p className="text-sm text-app-muted">Technical detail: {detail}</p>}
      {children}
    </div>
  )
}

type StatusBannerProps = {
  /** Tailwind classes for the border and text colour, for example `border-red-700 text-red-700`. */
  tone: string
  children: ReactNode
}

/** A result summary line, announced politely. */
export function StatusBanner({ tone, children }: StatusBannerProps) {
  return (
    <p role="status" className={`rounded-xl border bg-app-surface px-4 py-3 font-semibold ${tone}`}>
      {children}
    </p>
  )
}

/** The small live region next to the buttons ("Copied to clipboard"). Empty text announces nothing. */
export function CopyStatus({ message, className = '' }: { message: string; className?: string }) {
  return (
    <span role="status" className={`text-sm text-app-muted ${className}`}>
      {message}
    </span>
  )
}
