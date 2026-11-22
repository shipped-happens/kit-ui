/** The promise for apps that run only in the browser. Server apps pass their own sentence. */
export const BROWSER_PROMISE = 'Everything stays in your browser. Nothing is sent anywhere.'

type AppFooterProps = {
  /** What happens to the visitor's data, in plain words. Defaults to the browser-only promise. */
  promise?: string
}

export function AppFooter({ promise = BROWSER_PROMISE }: AppFooterProps) {
  return (
    <footer className="flex flex-wrap items-center gap-4 border-t border-app-border pt-4 text-sm text-app-muted">
      <span>{promise}</span>
      <a className="inline-flex min-h-6 items-center underline" href="/privacy/">
        Privacy
      </a>
      <a className="inline-flex min-h-6 items-center underline" href="/terms/">
        Terms
      </a>
    </footer>
  )
}
