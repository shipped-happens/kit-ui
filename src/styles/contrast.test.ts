// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')

function block(source: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [, name, value] of source.matchAll(/(--color-[a-z-]+):\s*(#[0-9a-fA-F]{6})/g))
    out[name] = value
  return out
}

const darkStart = css.indexOf('prefers-color-scheme: dark')
const light = block(css.slice(0, darkStart))
const dark = { ...light, ...block(css.slice(darkStart)) }

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Text pairs that must reach 4.5:1 in both themes.
const textPairs: [string, string][] = [
  ['--color-text', '--color-bg'],
  ['--color-text', '--color-surface'],
  ['--color-muted', '--color-bg'],
  ['--color-muted', '--color-surface'],
  ['--color-accent-text', '--color-bg'],
  ['--color-accent-text', '--color-surface'],
  ['--color-accent-contrast', '--color-accent'],
  ['--color-del-text', '--color-del-bg'],
  ['--color-ins-text', '--color-ins-bg'],
  ['--color-warn-text', '--color-warn-bg'],
]

describe('token contrast', () => {
  for (const [theme, colors] of [
    ['light', light],
    ['dark', dark],
  ] as const) {
    for (const [fg, bg] of textPairs) {
      it(`${theme}: ${fg} on ${bg} is at least 4.5:1`, () => {
        expect(colors[fg], `${fg} missing`).toBeDefined()
        expect(colors[bg], `${bg} missing`).toBeDefined()
        expect(ratio(colors[fg], colors[bg])).toBeGreaterThanOrEqual(4.5)
      })
    }
  }

  it('keeps the fill amber unusable as text on paper (about 2.1:1), which is why text amber is separate', () => {
    expect(ratio(light['--color-accent'], light['--color-bg'])).toBeLessThan(3)
  })
})
