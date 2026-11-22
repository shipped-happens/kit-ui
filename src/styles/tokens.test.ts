// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8')
const theme = readFileSync(new URL('./theme.css', import.meta.url), 'utf8')

describe('tokens.css', () => {
  it('defines the core tokens and a dark theme', () => {
    const core = [
      '--color-bg',
      '--color-text',
      '--color-accent',
      '--color-accent-text',
      '--color-border',
      '--font-sans',
      '--font-display',
    ]
    for (const t of core) expect(tokens, `missing ${t}`).toContain(`${t}:`)
    expect(tokens).toContain('prefers-color-scheme: dark')
  })

  it('draws the focus ring with the text amber, not the fill amber', () => {
    const block = tokens.match(/:focus-visible\s*\{[^}]*\}/)?.[0] ?? ''
    expect(block).toContain('var(--color-accent-text)')
    expect(block).not.toMatch(/var\(--color-accent\)/)
  })
})

describe('theme.css', () => {
  it('maps every colour token the components use to an app-* utility', () => {
    const names = [
      'bg',
      'surface',
      'text',
      'muted',
      'accent',
      'accent-text',
      'accent-contrast',
      'border',
    ]
    for (const name of names) {
      expect(theme).toContain(`--color-app-${name}: var(--color-${name})`)
    }
    expect(theme).toContain('--font-app-display')
  })

  it('only names tokens that tokens.css defines', () => {
    for (const [, name] of theme.matchAll(/var\((--[a-z-]+)\)/g)) {
      expect(tokens, `tokens.css lacks ${name}`).toContain(`${name}:`)
    }
  })
})
