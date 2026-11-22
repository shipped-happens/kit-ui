import type { ReactNode } from 'react'
import { StatusPill } from '../parts/StatusPill'

type PageTitleProps = {
  name: string
  /** One plain sentence: what it does for whom. */
  description: string
  /** For example "Privacy" or "Media". Shown after the description, as a quiet pill. */
  category?: string
  children?: ReactNode
}

/** The one h1. It rises in on load (once, and not at all with reduced motion). */
export function PageTitle({ name, description, category, children }: PageTitleProps) {
  return (
    <section className="flex flex-col gap-3 pt-2 md:pt-6">
      <h1 className="kit-hero-face kit-rise text-4xl leading-none md:text-6xl">{name}</h1>
      <p className="kit-rise kit-rise-2 max-w-2xl text-lg text-app-muted">{description}</p>
      {category && (
        <div>
          <StatusPill tone="soft">{category}</StatusPill>
        </div>
      )}
      {children}
    </section>
  )
}
