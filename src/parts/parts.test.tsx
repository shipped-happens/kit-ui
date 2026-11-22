import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  BeforeAfter,
  BlankResult,
  Button,
  CaveatList,
  CopyButton,
  CopyStatus,
  DocumentPreview,
  DropZone,
  ErrorBanner,
  ExampleChips,
  Field,
  Meter,
  ResultList,
  ResultRow,
  Segmented,
  SettingsPanel,
  Slider,
  StatusBanner,
  StatusPill,
} from '../index'

const png = (name: string, bytes = 1000) =>
  new File([new Uint8Array(bytes)], name, { type: 'image/png' })

describe('Button', () => {
  it('is type=button by default so it never submits a form by accident', () => {
    render(<Button>Clear</Button>)
    expect(screen.getByRole('button', { name: 'Clear' })).toHaveAttribute('type', 'button')
  })

  it('primary is the amber action, ghost is the outline', () => {
    render(
      <>
        <Button variant="primary">Shrink</Button>
        <Button>Clear</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Shrink' }).className).toContain('kit-btn-primary')
    expect(screen.getByRole('button', { name: 'Clear' }).className).toContain('kit-btn-ghost')
  })
})

describe('banners', () => {
  it('ErrorBanner is an alert: the problem first, then the hint, then the detail last', () => {
    render(
      <ErrorBanner error="Not a type this tool can open." hint="Pick a JPEG." detail="image/gif" />,
    )
    const text = screen.getByRole('alert').textContent ?? ''
    expect(text.indexOf('Not a type')).toBeLessThan(text.indexOf('Pick a JPEG.'))
    expect(text.indexOf('Pick a JPEG.')).toBeLessThan(text.indexOf('Technical detail: image/gif'))
  })

  it('StatusBanner is a polite status', () => {
    render(<StatusBanner tone="border-red-700">Expired</StatusBanner>)
    expect(screen.getByRole('status')).toHaveTextContent('Expired')
  })

  it('CopyStatus is empty until there is something to say', () => {
    render(<CopyStatus message="" />)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})

describe('StatusPill', () => {
  it('has a soft variant for categories', () => {
    render(<StatusPill tone="soft">Media</StatusPill>)
    expect(screen.getByText('Media').className).toContain('kit-status-soft')
  })
})

describe('DropZone', () => {
  it('is a real file input named by its label', () => {
    render(
      <DropZone label="Choose images" onFiles={() => {}} accept={['image/png']} maxBytes={2048} />,
    )
    const input = screen.getByLabelText(/Choose images/)
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('accept', 'image/png')
    expect(screen.getByText(/up to 2 KB/)).toBeInTheDocument()
  })

  it('passes accepted files and explains each rejected one in words', async () => {
    const onFiles = vi.fn()
    const onReject = vi.fn()
    render(
      <DropZone
        label="Choose"
        multiple
        accept={['image/png']}
        maxBytes={2000}
        onFiles={onFiles}
        onReject={onReject}
      />,
    )
    const input = screen.getByLabelText(/Choose/) as HTMLInputElement
    const good = png('ok.png')
    const big = png('big.png', 5000)
    const wrong = new File(['x'], 'doc.txt', { type: 'text/plain' })
    await userEvent.setup({ applyAccept: false }).upload(input, [good, big, wrong])
    expect(onFiles).toHaveBeenCalledWith([good])
    const reasons = onReject.mock.calls[0][0] as string[]
    expect(reasons).toHaveLength(2)
    expect(reasons.join(' ')).toContain('big.png is 4.9 KB; the limit is 2 KB.')
    expect(reasons.join(' ')).toContain('doc.txt is not a type this tool can open.')
  })

  it('takes one file when multiple is off and says so', () => {
    const onFiles = vi.fn()
    const onReject = vi.fn()
    render(<DropZone label="Choose" onFiles={onFiles} onReject={onReject} />)
    const a = png('a.png')
    const b = png('b.png')
    fireEvent.change(screen.getByLabelText(/Choose/), { target: { files: [a, b] } })
    expect(onFiles).toHaveBeenCalledWith([a])
    expect(onReject.mock.calls[0][0][0]).toContain('one file at a time')
  })

  it('accepts a drop and shows the over state while dragging', () => {
    const onFiles = vi.fn()
    const { container } = render(<DropZone label="Choose" multiple onFiles={onFiles} />)
    const zone = container.querySelector('label') as HTMLElement
    fireEvent.dragOver(zone)
    expect(zone).toHaveAttribute('data-over', 'true')
    const file = png('dropped.png')
    fireEvent.drop(zone, { dataTransfer: { files: [file] } })
    expect(zone).toHaveAttribute('data-over', 'false')
    expect(onFiles).toHaveBeenCalledWith([file])
  })
})

describe('controls', () => {
  it('Segmented is a radio group; choosing calls onChange', async () => {
    const onChange = vi.fn()
    render(
      <Segmented
        legend="Output format"
        value="webp"
        onChange={onChange}
        options={[
          { value: 'jpeg', label: 'JPEG' },
          { value: 'webp', label: 'WebP' },
        ]}
      />,
    )
    expect(screen.getByRole('group', { name: 'Output format' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'WebP' })).toBeChecked()
    await userEvent.click(screen.getByRole('radio', { name: 'JPEG' }))
    expect(onChange).toHaveBeenCalledWith('jpeg')
  })

  it('Slider shows its value in words and reports changes as numbers', () => {
    const onChange = vi.fn()
    render(
      <Slider
        label="Quality"
        value={80}
        min={10}
        max={100}
        onChange={onChange}
        format={(v) => `${v}%`}
      />,
    )
    const slider = screen.getByRole('slider', { name: /Quality/ })
    expect(slider).toHaveAttribute('aria-valuetext', '80%')
    expect(screen.getByText('80%')).toBeInTheDocument()
    fireEvent.change(slider, { target: { value: '55' } })
    expect(onChange).toHaveBeenCalledWith(55)
  })

  it('Meter is a labelled progress element', () => {
    render(<Meter value={40} label="Shrinking images" />)
    expect(screen.getByRole('progressbar', { name: 'Shrinking images' })).toHaveAttribute(
      'value',
      '40',
    )
  })

  it('SettingsPanel shows the action and the note', () => {
    render(
      <SettingsPanel
        action={<Button variant="primary">Shrink</Button>}
        note="Processed in your browser."
      >
        <p>options</p>
      </SettingsPanel>,
    )
    expect(screen.getByRole('region', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Shrink' })).toBeInTheDocument()
    expect(screen.getByText('Processed in your browser.')).toBeInTheDocument()
  })
})

describe('results', () => {
  const side = (title: string, bytes: number) => ({ title, bytes })

  it('BeforeAfter says how much smaller, in words', () => {
    render(<BeforeAfter before={side('Before', 2_758_000)} after={side('After', 294_000)} />)
    expect(screen.getByText(/89% smaller/)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/-\d+%/)
  })

  it('BeforeAfter warns when the result grew instead of showing a negative saving', () => {
    render(<BeforeAfter before={side('Before', 90_000)} after={side('After', 120_000)} />)
    expect(screen.getByText(/33% larger/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('larger than the original')
  })

  it('BeforeAfter shows a blank labelled box until there is a result', () => {
    render(<BeforeAfter before={side('Before', 1000)} after={null} />)
    expect(screen.getByText('After')).toBeInTheDocument()
    expect(screen.getByText(/appears here/)).toBeInTheDocument()
  })

  it('ResultList and ResultRow list each file with sizes', () => {
    render(
      <ResultList label="Compressed files">
        <ResultRow
          name="a.jpg"
          beforeBytes={2048}
          afterBytes={1024}
          action={<Button>Download</Button>}
        />
      </ResultList>,
    )
    expect(screen.getByRole('list', { name: 'Compressed files' })).toBeInTheDocument()
    expect(screen.getByText(/2 KB to 1 KB, 50% smaller/)).toBeInTheDocument()
  })

  it('BlankResult is labelled and says what to do', () => {
    render(<BlankResult title="Result">Paste text and press Clean.</BlankResult>)
    expect(screen.getByText('Result')).toBeInTheDocument()
    expect(screen.getByText('Paste text and press Clean.')).toBeInTheDocument()
  })
})

describe('helpers', () => {
  it('CaveatList is a titled list', () => {
    render(<CaveatList items={['PNG barely shrinks.', 'Detail cannot come back.']} />)
    expect(screen.getByRole('region', { name: 'What this cannot do' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('ExampleChips picks an example by id', async () => {
    const onPick = vi.fn()
    render(<ExampleChips examples={[{ id: 'web', label: 'From a website' }]} onPick={onPick} />)
    await userEvent.click(screen.getByRole('button', { name: 'From a website' }))
    expect(onPick).toHaveBeenCalledWith('web')
  })

  it('CopyButton copies and says so', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<CopyButton text="hello" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard'))
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('CopyButton says so when the browser refuses', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('no')) },
      configurable: true,
    })
    render(<CopyButton text="hello" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Could not copy'))
  })

  it('Field wires the label, hint and error to the control', () => {
    render(
      <Field label="Amount due" hint="In your currency." error="Enter an amount.">
        {(p) => <input {...p} />}
      </Field>,
    )
    const input = screen.getByLabelText('Amount due')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const described = input.getAttribute('aria-describedby') ?? ''
    expect(described.split(' ')).toHaveLength(2)
    expect(screen.getByText('Enter an amount.')).toHaveAttribute('id', described.split(' ')[1])
  })

  it('DocumentPreview keeps the sheet light and puts actions beside the title', () => {
    render(
      <DocumentPreview title="Your message" actions={<Button>Copy</Button>}>
        <p>Hello Maria</p>
      </DocumentPreview>,
    )
    expect(screen.getByRole('region', { name: 'Your message' })).toBeInTheDocument()
    expect(screen.getByText('Hello Maria').parentElement?.className).toContain('bg-white')
  })
})
