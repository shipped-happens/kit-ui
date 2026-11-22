import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppShell, canTrackPointer } from '../index'

function mockMedia(matches: Record<string, boolean>) {
  window.matchMedia = ((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

const FINE = '(hover: hover) and (pointer: fine)'
const REDUCED = '(prefers-reduced-motion: reduce)'

afterEach(() => {
  document.documentElement.style.removeProperty('--px')
  document.documentElement.style.removeProperty('--py')
  vi.restoreAllMocks()
})

describe('pointer effects', () => {
  it('track only for a fine pointer and never with reduced motion', () => {
    mockMedia({ [FINE]: true, [REDUCED]: false })
    expect(canTrackPointer()).toBe(true)
    mockMedia({ [FINE]: true, [REDUCED]: true })
    expect(canTrackPointer()).toBe(false)
    mockMedia({ [FINE]: false, [REDUCED]: false })
    expect(canTrackPointer()).toBe(false)
  })

  it('moves the stage light with the cursor when allowed', async () => {
    mockMedia({ [FINE]: true, [REDUCED]: false })
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 1
    })
    Object.defineProperty(window, 'innerWidth', { value: 1000, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 500, configurable: true })
    render(
      <AppShell>
        <p>x</p>
      </AppShell>,
    )
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 250, clientY: 250 }))
    expect(document.documentElement.style.getPropertyValue('--px')).toBe('0.250')
    expect(document.documentElement.style.getPropertyValue('--py')).toBe('0.500')
  })

  it('does nothing for touch, and cleans up on unmount', () => {
    mockMedia({ [FINE]: false, [REDUCED]: false })
    const { unmount } = render(
      <AppShell>
        <p>x</p>
      </AppShell>,
    )
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 250, clientY: 250 }))
    expect(document.documentElement.style.getPropertyValue('--px')).toBe('')
    unmount()
    expect(document.documentElement.style.getPropertyValue('--px')).toBe('')
  })
})
