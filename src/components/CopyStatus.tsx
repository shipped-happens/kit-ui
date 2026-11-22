/** The small "Copied to clipboard" note next to the buttons. Empty text announces nothing. */
export function CopyStatus({ message }: { message: string }) {
  return (
    <span role="status" className="text-sm text-app-muted">
      {message}
    </span>
  )
}
