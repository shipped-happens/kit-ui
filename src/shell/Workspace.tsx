import { useId } from 'react'
import type { ElementType, ReactNode } from 'react'

type PanelProps = {
  title?: string
  children: ReactNode
  as?: ElementType
  className?: string
  quiet?: boolean
}

/** A near-opaque panel (never glass), 16px corners. With a title it becomes a labelled region. */
export function Panel({
  title,
  children,
  as: Tag = 'section',
  className = '',
  quiet = false,
}: PanelProps) {
  const id = useId()
  return (
    <Tag
      aria-labelledby={title ? id : undefined}
      className={`kit-panel${quiet ? ' kit-panel-quiet' : ''} flex flex-col gap-4 p-5 md:p-6 ${className}`}
    >
      {title && (
        <h2 id={id} className="kit-h text-base font-semibold">
          {title}
        </h2>
      )}
      {children}
    </Tag>
  )
}

/** Input on the left, result on the right; they stack on a phone. For text tools. */
export function TwoPane({ input, result }: { input: ReactNode; result: ReactNode }) {
  return (
    <div className="grid flex-1 gap-4 md:grid-cols-2">
      {input}
      {result}
    </div>
  )
}

/**
 * Result cards on the left, a settings panel on the right. For image, QR and file tools.
 * On a phone the settings come first, then the results.
 */
export function ResultSettings({ results, settings }: { results: ReactNode; settings: ReactNode }) {
  return (
    <div className="grid flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="order-2 flex min-w-0 flex-col gap-4 lg:order-1">{results}</div>
      <div className="order-1 lg:sticky lg:top-24 lg:order-2">{settings}</div>
    </div>
  )
}
