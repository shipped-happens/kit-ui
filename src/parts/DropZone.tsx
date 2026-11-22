import { useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { checkFile, formatBytes } from '../lib/format'

type DropZoneProps = {
  /** The action, for example "Choose images or drop them here". */
  label: string
  /** Called with the files that passed the checks. */
  onFiles: (files: File[]) => void
  /** Called with one plain sentence per file that did not pass. Show them in an ErrorBanner. */
  onReject?: (reasons: string[]) => void
  /** Extensions (".docx") or MIME types ("image/*", "image/png"). */
  accept?: string[]
  multiple?: boolean
  maxBytes?: number
  maxFiles?: number
  /** Overrides the default line about type and size limits. */
  hint?: string
}

/**
 * A real file input stretched over a dashed target, so keyboard and screen readers get a normal control
 * and mouse users can drop files on it. Types and sizes are checked here; nothing is uploaded anywhere.
 */
export function DropZone({
  label,
  onFiles,
  onReject,
  accept,
  multiple = false,
  maxBytes,
  maxFiles,
  hint,
}: DropZoneProps) {
  const [over, setOver] = useState(false)

  const handle = (list: FileList | null) => {
    if (!list || list.length === 0) return
    const files = Array.from(list)
    const reasons: string[] = []
    const accepted: File[] = []
    for (const file of files) {
      const result = checkFile(file, { accept, maxBytes })
      if (result.ok) accepted.push(file)
      else reasons.push(result.reason)
    }
    let kept = multiple ? accepted : accepted.slice(0, 1)
    if (!multiple && accepted.length > 1)
      reasons.push('This tool takes one file at a time; the first one was used.')
    if (maxFiles !== undefined && kept.length > maxFiles) {
      reasons.push(`Up to ${maxFiles} files at a time; the first ${maxFiles} were used.`)
      kept = kept.slice(0, maxFiles)
    }
    if (reasons.length > 0) onReject?.(reasons)
    if (kept.length > 0) onFiles(kept)
  }

  const defaultHint = [
    accept && accept.length > 0 ? accept.join(', ') : null,
    maxBytes !== undefined ? `up to ${formatBytes(maxBytes)}${multiple ? ' each' : ''}` : null,
  ]
    .filter(Boolean)
    .join(', ')

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setOver(false)
    handle(e.dataTransfer.files)
  }

  return (
    <label
      className="kit-drop"
      data-over={over}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        multiple={multiple}
        accept={accept?.join(',')}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handle(e.target.files)
          e.target.value = ''
        }}
      />
      <span className="text-base font-semibold">{label}</span>
      <span className="text-sm text-app-muted">{hint ?? defaultHint}</span>
    </label>
  )
}
