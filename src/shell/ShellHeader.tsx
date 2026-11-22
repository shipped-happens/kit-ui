type ShellHeaderProps = {
  /** The SH mark. Kept out of the kit on purpose: the app serves its own copy, for example "/mark.png". Left out when not given. */
  markSrc?: string
  homeHref?: string
}

/** The floating glass bar. It is the only glass in the app shell; panels stay near-opaque so text keeps its contrast. */
export function ShellHeader({
  markSrc,
  homeHref = 'https://shippedhappens.org',
}: ShellHeaderProps) {
  return (
    <header className="kit-glass sticky top-3 z-10 flex items-center gap-3 rounded-full px-3 py-2 md:px-4">
      <a
        href={homeHref}
        aria-label="Shipped Happens, home"
        className="flex items-center gap-3 no-underline"
      >
        {markSrc && <img src={markSrc} alt="" width={36} height={36} />}
        {/* With a mark, the wordmark gives way on a narrow phone. Without one it stays, so the left side is never empty. */}
        <span className={`kit-hero-face text-xl${markSrc ? ' hidden min-[420px]:inline' : ''}`}>
          Shipped<span className="text-app-accent-text">.</span> Happens
          <span className="text-app-accent-text">.</span>
        </span>
      </a>
      <a
        href={homeHref}
        className="ml-auto inline-flex min-h-8 items-center text-sm font-medium underline-offset-4 hover:text-app-accent-text hover:underline"
      >
        All apps
      </a>
    </header>
  )
}
