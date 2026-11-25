import { useEffect, useState } from 'react'
import { buttonClass } from './Button'

type ShareButtonProps = { title: string; text?: string; url: string }

/** Opens the phone or browser share sheet when there is one, otherwise copies the link. */
export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!status) return
    const timer = setTimeout(() => setStatus(''), 3000)
    return () => clearTimeout(timer)
  }, [status])

  const share = async () => {
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title, text, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setStatus('Link copied')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setStatus('Could not share. Copy the address from the address bar.')
    }
  }

  return (
    // No gap: an empty status must take no room, but stay mounted so it is announced.
    <span className="inline-flex items-center">
      <button type="button" className={`${buttonClass} py-1`} onClick={share}>
        Share this tool
      </button>
      <span aria-live="polite" className="not-empty:ml-2">
        {status}
      </span>
    </span>
  )
}
