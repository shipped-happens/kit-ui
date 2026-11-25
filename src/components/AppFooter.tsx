import type { ReactNode } from 'react'

/** The promise for apps that run only in the browser. Server apps pass their own sentence. */
export const BROWSER_PROMISE = 'Everything stays in your browser. Nothing is sent anywhere.'

type AppFooterProps = {
  /** What happens to the visitor's data, in plain words. Defaults to the browser-only promise. */
  promise?: string
  homeHref?: string
  /** Extra items on the right under the studio link, for example a ShareButton. */
  children?: ReactNode
}

/** Two balanced groups: promise over legal links on the left, studio link over extras on the right. Stacked and centred on a phone. */
export function AppFooter({
  promise = BROWSER_PROMISE,
  homeHref = 'https://shippedhappens.org',
  children,
}: AppFooterProps) {
  const link = 'inline-flex min-h-6 items-center underline'
  return (
    <footer className="flex flex-col items-center gap-4 border-t border-app-border pt-6 text-center text-sm text-app-muted md:flex-row md:items-start md:justify-between md:text-left">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <p>{promise}</p>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-4 md:justify-start">
          <a className={link} href="/privacy/">
            Privacy
          </a>
          <a className={link} href="/terms/">
            Terms
          </a>
          <a className={link} href="/disclaimer/">
            Disclaimer
          </a>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-2 md:items-end">
        <a className={link} href={homeHref}>
          Made by Shipped Happens
        </a>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </footer>
  )
}
