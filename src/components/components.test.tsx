import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  AppFooter,
  AppHeader,
  BROWSER_PROMISE,
  Button,
  CopyStatus,
  ErrorBanner,
  StatusBanner,
} from '../index'

describe('AppHeader', () => {
  it('shows the name as the one h1 and the description', () => {
    render(<AppHeader name="JSON Beautifier" description="Format JSON." />)
    expect(screen.getByRole('heading', { level: 1, name: 'JSON Beautifier' })).toBeInTheDocument()
    expect(screen.getByText('Format JSON.')).toBeInTheDocument()
  })
})

describe('AppFooter', () => {
  it('says the browser promise by default and links Privacy and Terms', () => {
    render(<AppFooter />)
    expect(screen.getByText(BROWSER_PROMISE)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms/')
  })

  it('lets a server app say what it sends instead', () => {
    render(<AppFooter promise="The link is sent to our checker when you press Check." />)
    expect(screen.queryByText(BROWSER_PROMISE)).not.toBeInTheDocument()
    expect(screen.getByText(/sent to our checker/)).toBeInTheDocument()
  })

  it('never claims safety', () => {
    expect(BROWSER_PROMISE).not.toMatch(/\b(safe|secure)\b/i)
  })
})

describe('ErrorBanner', () => {
  it('is an alert with the problem first, then the hint, then the detail last', () => {
    render(
      <ErrorBanner
        error="Not valid JSON."
        hint="Check the commas."
        detail="Unexpected token at 12"
      />,
    )
    const text = screen.getByRole('alert').textContent ?? ''
    expect(text.indexOf('Not valid JSON.')).toBeLessThan(text.indexOf('Check the commas.'))
    expect(text.indexOf('Check the commas.')).toBeLessThan(
      text.indexOf('Technical detail: Unexpected token at 12'),
    )
  })

  it('leaves out the hint and detail when not given', () => {
    render(<ErrorBanner error="Nope." />)
    expect(screen.getByRole('alert').querySelectorAll('p')).toHaveLength(1)
  })
})

describe('StatusBanner', () => {
  it('is a polite status with the given tone', () => {
    render(<StatusBanner tone="border-red-700">Expired</StatusBanner>)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Expired')
    expect(status.className).toContain('border-red-700')
  })
})

describe('Button', () => {
  it('is type=button by default so it never submits a form by accident', () => {
    render(<Button>Clear</Button>)
    expect(screen.getByRole('button', { name: 'Clear' })).toHaveAttribute('type', 'button')
  })

  it('uses the amber fill for primary and a border for secondary', () => {
    render(
      <>
        <Button variant="primary">Format</Button>
        <Button>Clear</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Format' }).className).toContain('bg-app-accent')
    expect(screen.getByRole('button', { name: 'Clear' }).className).toContain('border-app-border')
  })
})

describe('CopyStatus', () => {
  it('renders an empty status region until there is something to say', () => {
    render(<CopyStatus message="" />)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})
