import { useId } from 'react'
import type { ReactNode } from 'react'
import { Panel } from '../shell/Workspace'

type SettingsPanelProps = {
  title?: string
  children: ReactNode
  /** The one primary button. */
  action?: ReactNode
  /** One plain sentence next to the button, for example what is processed and where. */
  note?: ReactNode
}

/** The right-hand column of a ResultSettings layout. */
export function SettingsPanel({ title = 'Settings', children, action, note }: SettingsPanelProps) {
  return (
    <Panel title={title} className="gap-5">
      {children}
      {action && <div className="flex flex-col gap-2 [&>.kit-btn]:w-full">{action}</div>}
      {note && <p className="text-sm text-app-muted">{note}</p>}
    </Panel>
  )
}

type SegmentedProps<T extends string> = {
  legend: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  disabled?: boolean
}

/** Pick one of a few options, for example an output format. Native radio buttons, so arrow keys work. */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
  disabled,
}: SegmentedProps<T>) {
  const name = useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="kit-seg">
        {options.map((o) => (
          <label key={o.value}>
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={o.value === value}
              disabled={disabled}
              onChange={() => onChange(o.value)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  /** How to show the value, for example (v) => `${v}%`. */
  format?: (value: number) => string
  minLabel?: string
  maxLabel?: string
  hint?: string
}

/** A native range input with the value always visible. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = String,
  minLabel,
  maxLabel,
  hint,
}: SliderProps) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex items-center justify-between gap-3 text-sm font-semibold">
        <span>{label}</span>
        <output
          htmlFor={id}
          className="kit-num rounded-full bg-app-accent px-3 py-0.5 text-sm font-semibold text-app-accent-contrast"
        >
          {format(value)}
        </output>
      </label>
      <input
        id={id}
        type="range"
        className="kit-range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        aria-describedby={hint ? hintId : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-app-muted">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
      {hint && (
        <p id={hintId} className="text-sm text-app-muted">
          {hint}
        </p>
      )}
    </div>
  )
}

/** Progress for work in a background worker. A native progress element, so there is no inline style. */
export function Meter({ value, max = 100, label }: { value: number; max?: number; label: string }) {
  return <progress className="kit-meter" value={value} max={max} aria-label={label} />
}
