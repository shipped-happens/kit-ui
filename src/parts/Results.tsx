import type { ReactNode } from 'react'
import { describeSaving, formatBytes } from '../lib/format'
import { Panel } from '../shell/Workspace'

/** The boxes a result would fill, blank and labelled, with one muted sentence about what to do. Never a single line of text. */
export function BlankResult({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="kit-blank flex min-h-32 flex-col gap-1 p-4 text-sm text-app-muted">
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">{title}</span>
      <p>{children}</p>
    </div>
  )
}

type Side = {
  /** For example "Before" or "After". */
  title: string
  bytes: number
  /** The picture or text itself. */
  media?: ReactNode
  /** For example "1408 x 768". */
  meta?: ReactNode
}

/**
 * Before and after, with real sizes. A result that grew says so in words and never shows a bare minus sign.
 * `after` is null until there is a result; then a blank box shows what will appear.
 */
export function BeforeAfter({
  before,
  after,
  action,
}: {
  before: Side
  after: Side | null
  action?: ReactNode
}) {
  const saving = after ? describeSaving(before.bytes, after.bytes) : null
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel title={before.title}>
        {before.media}
        <p className="kit-num text-sm text-app-muted">
          {formatBytes(before.bytes)}
          {before.meta && <span> · {before.meta}</span>}
        </p>
      </Panel>
      {after ? (
        <Panel title={after.title}>
          {after.media}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="kit-num text-sm">
              <span className="font-semibold">{formatBytes(after.bytes)}</span>
              {saving && <span className="text-app-muted">, {saving.text}</span>}
              {after.meta && <span className="text-app-muted"> · {after.meta}</span>}
            </p>
            {action}
          </div>
          {saving?.direction === 'larger' && (
            <p
              role="status"
              className="rounded-xl border border-app-warn-border bg-app-warn-bg px-3 py-2 text-sm text-app-warn-text"
            >
              The result is larger than the original. Keep the original, or lower the quality.
            </p>
          )}
        </Panel>
      ) : (
        <BlankResult title="After">The smaller version appears here, with its size.</BlankResult>
      )}
    </div>
  )
}

/** A list of results, one ResultRow each, for batch tools. */
export function ResultList({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-col gap-2">
      {children}
    </ul>
  )
}

type ResultRowProps = {
  name: string
  beforeBytes: number
  afterBytes: number
  /** Usually a download Button. */
  action?: ReactNode
}

export function ResultRow({ name, beforeBytes, afterBytes, action }: ResultRowProps) {
  const saving = describeSaving(beforeBytes, afterBytes)
  return (
    <li className="kit-panel flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
      <span className="min-w-0 flex-1 truncate font-semibold" title={name}>
        {name}
      </span>
      <span className="kit-num text-sm text-app-muted">
        {formatBytes(beforeBytes)} to {formatBytes(afterBytes)}, {saving.text}
      </span>
      {action}
    </li>
  )
}
