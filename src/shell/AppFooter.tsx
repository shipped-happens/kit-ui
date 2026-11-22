import type { ReactNode } from 'react'

/** The promise for apps that run only in the browser. Server apps pass their own sentence. */
export const BROWSER_PROMISE = 'Everything stays in your browser. Nothing is sent anywhere.'

type AppFooterProps = {
  /** What happens to the visitor's data, in plain words. Defaults to the browser-only promise. */
  promise?: string
  homeHref?: string
  /** Extra items at the end, for example a ShareButton. */
  children?: ReactNode
}

export function AppFooter({
  promise = BROWSER_PROMISE,
  homeHref = 'https://shippedhappens.org',
  children,
}: AppFooterProps) {
  const link =
    'inline-flex min-h-6 items-center underline underline-offset-4 hover:text-app-accent-text'
  return (
    <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-app-border pt-4 text-sm text-app-muted">
      <span>{promise}</span>
      <a className={link} href="/privacy/">
        Privacy
      </a>
      <a className={link} href="/terms/">
        Terms
      </a>
      <a className={link} href={homeHref}>
        Made by Shipped Happens
      </a>
      {children}
    </footer>
  )
}
