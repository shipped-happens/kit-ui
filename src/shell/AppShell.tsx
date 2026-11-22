import type { ReactNode } from 'react'
import { usePageGlow } from '../hooks/pointer'
import { AppFooter } from './AppFooter'
import { ShellHeader } from './ShellHeader'

type AppShellProps = {
  children: ReactNode
  /** Defaults to the browser-only footer. Pass your own AppFooter for a server app or to add a share button. */
  footer?: ReactNode
  markSrc?: string
  homeHref?: string
}

/**
 * The page frame for every v2 app: amber stage light, the glass header, one centred column, a footer.
 * Put a PageTitle first inside it, then your workspace.
 */
export function AppShell({ children, footer, markSrc, homeHref }: AppShellProps) {
  usePageGlow()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-20 focus:rounded-full focus:bg-app-surface focus:px-4 focus:py-2"
      >
        Skip to the tool
      </a>
      <div aria-hidden="true" className="kit-stage" />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-8 pt-4 text-app-text md:gap-8 md:px-8">
        <ShellHeader markSrc={markSrc} homeHref={homeHref} />
        <main id="main" className="flex flex-1 flex-col gap-6 md:gap-8">
          {children}
        </main>
        {footer ?? <AppFooter homeHref={homeHref} />}
      </div>
    </>
  )
}
