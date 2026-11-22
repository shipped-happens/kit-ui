import type { ReactNode } from 'react'

/** A small pill label. `live` has a filled dot; `soft` is hollow and muted, for categories and "not live yet". */
export function StatusPill({
  tone = 'live',
  children,
}: {
  tone?: 'live' | 'soft'
  children: ReactNode
}) {
  return (
    <span className={`kit-status${tone === 'soft' ? ' kit-status-soft' : ''}`}>{children}</span>
  )
}
