/** 1536 becomes "1.5 KB". Uses 1024 per step, like most file managers. */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${Math.round(bytes)} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const text = value >= 100 ? Math.round(value).toString() : value.toFixed(1).replace(/\.0$/, '')
  return `${text} ${units[unit]}`
}

export type Saving = {
  /** Plain sentence, for example "89% smaller" or "12% larger". Never a bare minus sign. */
  text: string
  /** 'smaller', 'larger' or 'same'. */
  direction: 'smaller' | 'larger' | 'same'
}

/** Compares a before and an after size. A result that grew says so instead of showing a negative saving. */
export function describeSaving(before: number, after: number): Saving {
  if (!(before > 0) || !Number.isFinite(after) || after < 0)
    return { text: 'size unknown', direction: 'same' }
  const pct = Math.round((Math.abs(before - after) / before) * 100)
  if (after === before || pct === 0) return { text: 'about the same size', direction: 'same' }
  return after < before
    ? { text: `${pct}% smaller`, direction: 'smaller' }
    : { text: `${pct}% larger`, direction: 'larger' }
}

export type FileCheck = { ok: true } | { ok: false; reason: string }

/** Checks one file against a type list and a size limit, in words a person can act on. */
export function checkFile(
  file: { name: string; size: number; type: string },
  options: { accept?: string[]; maxBytes?: number },
): FileCheck {
  const { accept, maxBytes } = options
  if (accept && accept.length > 0) {
    const lower = file.name.toLowerCase()
    const ok = accept.some((a) =>
      a.startsWith('.')
        ? lower.endsWith(a.toLowerCase())
        : a.endsWith('/*')
          ? file.type.startsWith(a.slice(0, -1))
          : file.type === a,
    )
    if (!ok) return { ok: false, reason: `${file.name} is not a type this tool can open.` }
  }
  if (maxBytes !== undefined && file.size > maxBytes) {
    return {
      ok: false,
      reason: `${file.name} is ${formatBytes(file.size)}; the limit is ${formatBytes(maxBytes)}.`,
    }
  }
  return { ok: true }
}
