import { useEffect } from 'react'

// Cursor effects only run for a mouse-like pointer and never for visitors who ask for reduced motion.
// They set CSS variables through the CSSOM, which the content security policy allows (unlike inline style attributes).
export function canTrackPointer(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n))

/** Page-wide glow position (--px and --py, each 0 to 1) that follows the cursor. Does nothing on touch or with reduced motion. */
export function usePageGlow() {
  useEffect(() => {
    if (!canTrackPointer()) return
    const root = document.documentElement
    let frame = 0
    let x = 0.5
    let y = 0.5
    const flush = () => {
      frame = 0
      root.style.setProperty('--px', x.toFixed(3))
      root.style.setProperty('--py', y.toFixed(3))
    }
    const move = (e: PointerEvent) => {
      x = clamp(e.clientX / window.innerWidth)
      y = clamp(e.clientY / window.innerHeight)
      if (!frame) frame = requestAnimationFrame(flush)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      if (frame) cancelAnimationFrame(frame)
      root.style.removeProperty('--px')
      root.style.removeProperty('--py')
    }
  }, [])
}
