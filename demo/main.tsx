import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  AppFooter,
  AppShell,
  BeforeAfter,
  BlankResult,
  Button,
  CaveatList,
  CopyButton,
  DocumentPreview,
  DropZone,
  ErrorBanner,
  ExampleChips,
  Field,
  fieldClass,
  Meter,
  PageTitle,
  Panel,
  ResultList,
  ResultRow,
  ResultSettings,
  Segmented,
  SettingsPanel,
  ShareButton,
  Slider,
  StatusBanner,
  TwoPane,
} from '../src'
import './demo.css'

// One page per layout, chosen by the hash: #image, #text or #form.
const view = window.location.hash.replace('#', '') || 'image'

function ImageDemo() {
  const [format, setFormat] = useState<'jpeg' | 'webp'>('webp')
  const [quality, setQuality] = useState(80)
  const [rejected, setRejected] = useState<string[]>([])
  const [done, setDone] = useState(true)
  return (
    <>
      <PageTitle
        name="Image Shrink"
        description="Make a photo small enough for the form that keeps rejecting it. The picture never leaves your device."
        category="Media"
      />
      {rejected.length > 0 && (
        <ErrorBanner error={rejected[0]} hint="Pick a JPEG, PNG or WebP under 20 MB." />
      )}
      <ResultSettings
        results={
          <>
            <DropZone
              label="Choose images or drop them here"
              multiple
              accept={['image/jpeg', 'image/png', 'image/webp']}
              maxBytes={20 * 1024 * 1024}
              onFiles={() => setDone(true)}
              onReject={setRejected}
            />
            {done ? (
              <>
                <BeforeAfter
                  before={{
                    title: 'Before',
                    bytes: 2_758_000,
                    meta: '1408 x 768',
                    media: (
                      <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-stone-400 to-stone-700" />
                    ),
                  }}
                  after={{
                    title: 'After',
                    bytes: 294_000,
                    meta: 'WebP',
                    media: (
                      <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-stone-400 to-stone-700" />
                    ),
                  }}
                  action={
                    <Button variant="primary" small>
                      Download
                    </Button>
                  }
                />
                <ResultList label="Compressed files">
                  <ResultRow
                    name="waterfall-trail-very-long-file-name-from-the-camera.jpg"
                    beforeBytes={2_758_000}
                    afterBytes={294_000}
                    action={<Button small>Download</Button>}
                  />
                  <ResultRow
                    name="receipt.png"
                    beforeBytes={90_000}
                    afterBytes={120_000}
                    action={<Button small>Download</Button>}
                  />
                </ResultList>
              </>
            ) : (
              <BlankResult title="Results">
                Drop one or more images above, then press Shrink.
              </BlankResult>
            )}
          </>
        }
        settings={
          <SettingsPanel
            action={
              <Button variant="primary" onClick={() => setDone(true)}>
                Shrink images
              </Button>
            }
            note="Processed in your browser. Nothing is uploaded."
          >
            <Segmented
              legend="Output format"
              value={format}
              onChange={setFormat}
              options={[
                { value: 'jpeg', label: 'JPEG' },
                { value: 'webp', label: 'WebP' },
              ]}
            />
            <Slider
              label="Quality"
              value={quality}
              min={10}
              max={100}
              onChange={setQuality}
              format={(v) => `${v}%`}
              minLabel="Small file"
              maxLabel="Best quality"
            />
            <Meter value={64} label="Shrinking images" />
          </SettingsPanel>
        }
      />
      <CaveatList
        items={[
          'PNG files barely shrink unless you switch the format.',
          'Saving again at a lower quality cannot bring detail back.',
        ]}
      />
    </>
  )
}

function TextDemo() {
  const [text, setText] = useState(
    'This  is  the original text.  It has  double spaces.\n\n\n\nAnd extra blank lines.',
  )
  const [broken, setBroken] = useState(false)
  return (
    <>
      <PageTitle
        name="Text Tidy"
        description="Clean up text copied from a website, a PDF or an email in one click."
        category="Productivity"
      />
      <ExampleChips
        examples={[
          { id: 'web', label: 'Copied from a website' },
          { id: 'pdf', label: 'Broken PDF lines' },
        ]}
        onPick={() => setText('Sample text.')}
      />
      {broken && (
        <ErrorBanner
          error="Nothing to clean yet."
          hint="Paste some text on the left, then press Clean."
          detail="empty input"
        />
      )}
      <StatusBanner tone="border-app-accent-text text-app-accent-text">
        Removed 4 extra spaces and 3 blank lines.
      </StatusBanner>
      <TwoPane
        input={
          <Panel title="Your text">
            <textarea
              className={`${fieldClass} min-h-56 font-mono text-sm`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              aria-label="Your text"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" onClick={() => setBroken((b) => !b)}>
                Clean
              </Button>
              <Button>Clear</Button>
            </div>
          </Panel>
        }
        result={
          <Panel title="Cleaned text">
            <BlankResult title="Result">
              Paste text and press Clean. The cleaned version shows here, with what changed.
            </BlankResult>
            <div className="flex items-center gap-2">
              <CopyButton text="cleaned" disabled />
            </div>
          </Panel>
        }
      />
    </>
  )
}

function FormDemo() {
  const [name, setName] = useState('')
  return (
    <>
      <PageTitle
        name="Payment Follow-up"
        description="Write a polite, firm payment reminder in a minute. Nothing is stored."
        category="Business"
      />
      <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <Panel title="Details">
          <Field label="Client name" hint="Used in the greeting only.">
            {(p) => (
              <input
                {...p}
                className={fieldClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
          </Field>
          <Field label="Amount due" error="Enter an amount, for example 1,250.">
            {(p) => <input {...p} className={fieldClass} inputMode="decimal" />}
          </Field>
          <Segmented
            legend="Tone"
            value="firm"
            onChange={() => {}}
            options={[
              { value: 'friendly', label: 'Friendly' },
              { value: 'firm', label: 'Firm' },
              { value: 'final', label: 'Final' },
            ]}
          />
          <Button variant="primary">Write the message</Button>
        </Panel>
        <DocumentPreview
          title="Your message"
          actions={
            <>
              <CopyButton text="x" small />
              <Button small>Download</Button>
            </>
          }
        >
          <p className="font-serif">Hello {name || 'Maria'},</p>
          <p className="mt-3 font-serif">
            A quick reminder that invoice 2041 for 1,250 is now 14 days past due. Please send
            payment by Friday.
          </p>
        </DocumentPreview>
      </div>
    </>
  )
}

function Demo() {
  return (
    <AppShell
      footer={
        <AppFooter>
          <ShareButton title="Demo" />
        </AppFooter>
      }
    >
      {view === 'text' ? <TextDemo /> : view === 'form' ? <FormDemo /> : <ImageDemo />}
    </AppShell>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
)
