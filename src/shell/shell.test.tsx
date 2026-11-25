import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  AppFooter,
  AppShell,
  BROWSER_PROMISE,
  PageTitle,
  Panel,
  ResultSettings,
  ShellHeader,
  TwoPane,
} from '../index'

describe('AppShell', () => {
  it('has a skip link, one main region, the header and the footer', () => {
    render(
      <AppShell>
        <PageTitle name="Image Shrink" description="Make photos smaller." />
      </AppShell>,
    )
    expect(screen.getByRole('link', { name: 'Skip to the tool' })).toHaveAttribute('href', '#main')
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('lets an app pass its own footer', () => {
    render(
      <AppShell
        footer={<AppFooter promise="The link is sent to our checker when you press Check." />}
      >
        <p>x</p>
      </AppShell>,
    )
    expect(screen.queryByText(BROWSER_PROMISE)).not.toBeInTheDocument()
    expect(screen.getByText(/sent to our checker/)).toBeInTheDocument()
  })
})

describe('ShellHeader', () => {
  it('links home twice and leaves out the mark when none is given', () => {
    const { container } = render(<ShellHeader />)
    expect(screen.getByRole('link', { name: 'Shipped Happens, home' })).toHaveAttribute(
      'href',
      'https://shippedhappens.org',
    )
    expect(screen.getByRole('link', { name: 'All apps' })).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('shows the app-served mark as decorative', () => {
    const { container } = render(<ShellHeader markSrc="/mark.png" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/mark.png')
    expect(img).toHaveAttribute('alt', '')
  })
})

describe('AppFooter', () => {
  it('says the browser promise by default, links Privacy, Terms, Disclaimer and the studio', () => {
    render(<AppFooter />)
    expect(screen.getByText(BROWSER_PROMISE)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms/')
    expect(screen.getByRole('link', { name: 'Disclaimer' })).toHaveAttribute('href', '/disclaimer/')
    expect(screen.getByRole('link', { name: 'Made by Shipped Happens' })).toHaveAttribute(
      'href',
      'https://shippedhappens.org',
    )
  })

  it('never claims safety in the default line', () => {
    expect(BROWSER_PROMISE).not.toMatch(/\b(safe|secure)\b/i)
  })
})

describe('PageTitle', () => {
  it('is the one h1, with the description and an optional category', () => {
    render(<PageTitle name="Text Tidy" description="Clean copied text." category="Productivity" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Text Tidy' })).toBeInTheDocument()
    expect(screen.getByText('Clean copied text.')).toBeInTheDocument()
    expect(screen.getByText('Productivity')).toBeInTheDocument()
  })
})

describe('layouts', () => {
  it('Panel with a title is a labelled region', () => {
    render(<Panel title="Your text">body</Panel>)
    expect(screen.getByRole('region', { name: 'Your text' })).toHaveTextContent('body')
  })

  it('TwoPane keeps input before result', () => {
    render(<TwoPane input={<p>input</p>} result={<p>result</p>} />)
    const text = document.body.textContent ?? ''
    expect(text.indexOf('input')).toBeLessThan(text.indexOf('result'))
  })

  it('ResultSettings puts settings first in the DOM on a phone and the results first on a large screen', () => {
    const { container } = render(
      <ResultSettings results={<p>results</p>} settings={<p>settings</p>} />,
    )
    const [resultsCol, settingsCol] = Array.from(container.firstElementChild?.children ?? [])
    expect(resultsCol.className).toContain('lg:order-1')
    expect(resultsCol.className).toContain('order-2')
    expect(settingsCol.className).toContain('order-1')
    expect(settingsCol.className).toContain('lg:order-2')
  })
})

describe('ShellHeader wordmark', () => {
  it('stays visible on a phone when there is no mark, so the bar is never empty on the left', () => {
    render(<ShellHeader />)
    const word = screen.getByText(/Shipped/)
    expect(word.className).not.toContain('hidden')
  })

  it('gives way to the mark on a narrow phone when there is one', () => {
    render(<ShellHeader markSrc="/mark.png" />)
    expect(screen.getByText(/Shipped/).className).toContain('min-[420px]:inline')
  })
})
