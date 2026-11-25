import { useEffect, useId, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { CopyStatus } from './Banner'

/** What the tool cannot do, near the input. Every tool needs one; none claims "safe" without the caveat. */
export function CaveatList({
  title = 'What this cannot do',
  items,
}: {
  title?: string
  items: string[]
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2 text-sm text-app-muted">
      <h2 id={id} className="kit-h text-sm font-semibold text-app-text">
        {title}
      </h2>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

type ExampleChipsProps<T extends string> = {
  label?: string
  examples: { id: T; label: string }[]
  onPick: (id: T) => void
}

/** One-click samples, so a first visit shows the tool working. */
export function ExampleChips<T extends string>({
  label = 'Try an example',
  examples,
  onPick,
}: ExampleChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-app-muted">{label}</span>
      {examples.map((e) => (
        <Button key={e.id} small onClick={() => onPick(e.id)}>
          {e.label}
        </Button>
      ))}
    </div>
  )
}

/** Hook: run an action and show a message for two seconds. */
function useFlash() {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 2000)
    return () => clearTimeout(timer)
  }, [message])
  return [message, setMessage] as const
}

type CopyButtonProps = {
  text: string | (() => string)
  label?: string
  disabled?: boolean
  small?: boolean
}

/** Copies text and says so. If the browser refuses, it says that too, instead of failing silently. */
export function CopyButton({ text, label = 'Copy', disabled, small }: CopyButtonProps) {
  const [message, setMessage] = useFlash()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(typeof text === 'function' ? text() : text)
      setMessage('Copied to clipboard')
    } catch {
      setMessage('Could not copy. Select the text and copy it yourself.')
    }
  }
  return (
    <>
      <Button small={small} disabled={disabled} onClick={copy}>
        {label}
      </Button>
      <CopyStatus message={message} />
    </>
  )
}

/** Uses the phone's share sheet when there is one, otherwise copies the link. */
export function ShareButton({ title, url, text }: { title: string; url?: string; text?: string }) {
  const [message, setMessage] = useFlash()
  const share = async () => {
    const link = url ?? window.location.href
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url: link })
        return
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(link)
      setMessage('Link copied')
    } catch {
      setMessage('Could not copy the link.')
    }
  }
  return (
    // No gap: an empty status must take no room, but stay mounted so it is announced.
    <span className="inline-flex items-center">
      <Button small onClick={share}>
        Share
      </Button>
      <CopyStatus message={message} className="not-empty:ml-2" />
    </span>
  )
}

type FieldProps = {
  label: string
  hint?: string
  error?: string
  children: (props: {
    id: string
    'aria-describedby'?: string
    'aria-invalid'?: boolean
  }) => ReactNode
}

/** A labelled form field with an optional hint and error, wired for screen readers. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ')
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': describedBy || undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-app-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

/** Class names for a text input, textarea or select, so forms in every app look the same. */
export const fieldClass =
  'w-full rounded-xl border border-app-border bg-app-surface px-3 py-2 text-base placeholder:text-app-muted aria-[invalid=true]:border-red-700'

/**
 * The document a form app generates: a paper sheet that stays light in dark mode, with its title and actions above it.
 * The sheet is the only card, so there is no card inside a card.
 */
export function DocumentPreview({
  title,
  children,
  actions,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
}) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id} className="kit-h text-base font-semibold">
          {title}
        </h2>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>
      <div className="rounded-2xl border border-stone-300 bg-white p-6 text-stone-900 shadow-md md:p-8">
        {children}
      </div>
    </section>
  )
}
