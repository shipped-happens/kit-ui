import { describe, expect, it } from 'vitest'
import { checkFile, describeSaving, formatBytes } from './format'

describe('formatBytes', () => {
  it('uses plain units', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(2048)).toBe('2 KB')
    expect(formatBytes(2_758_000)).toBe('2.6 MB')
    expect(formatBytes(294_000)).toBe('287 KB')
  })

  it('does not break on bad input', () => {
    expect(formatBytes(-5)).toBe('0 B')
    expect(formatBytes(Number.NaN)).toBe('0 B')
  })
})

describe('describeSaving', () => {
  it('says smaller, larger or the same, never a negative number', () => {
    expect(describeSaving(1000, 110)).toEqual({ text: '89% smaller', direction: 'smaller' })
    expect(describeSaving(1000, 1330)).toEqual({ text: '33% larger', direction: 'larger' })
    expect(describeSaving(1000, 1000)).toEqual({ text: 'about the same size', direction: 'same' })
    expect(describeSaving(1000, 1002).direction).toBe('same')
  })

  it('does not divide by zero', () => {
    expect(describeSaving(0, 10).text).toBe('size unknown')
  })
})

describe('checkFile', () => {
  const file = (name: string, size: number, type: string) => ({ name, size, type })

  it('matches extensions, exact types and type families', () => {
    expect(checkFile(file('a.DOCX', 1, ''), { accept: ['.docx'] }).ok).toBe(true)
    expect(checkFile(file('a.png', 1, 'image/png'), { accept: ['image/png'] }).ok).toBe(true)
    expect(checkFile(file('a.webp', 1, 'image/webp'), { accept: ['image/*'] }).ok).toBe(true)
    expect(checkFile(file('a.txt', 1, 'text/plain'), { accept: ['image/*'] }).ok).toBe(false)
  })

  it('names the file and the limit when it is too big', () => {
    const result = checkFile(file('big.png', 25 * 1024 * 1024, 'image/png'), {
      maxBytes: 20 * 1024 * 1024,
    })
    expect(result).toEqual({ ok: false, reason: 'big.png is 25 MB; the limit is 20 MB.' })
  })

  it('accepts anything when no rules are given', () => {
    expect(checkFile(file('x', 10, ''), {}).ok).toBe(true)
  })
})
