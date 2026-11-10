import { cn } from '@/lib/utils'

export const inputClass =
  'w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/30 aria-invalid:border-destructive aria-invalid:focus:ring-destructive/20'

export function Field({
  name,
  label,
  help,
  error,
  optional,
  children,
}: {
  name: string
  label: string
  help?: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        help && (
          <p id={`${name}-help`} className="text-xs leading-relaxed text-muted-foreground">
            {help}
          </p>
        )
      )}
    </div>
  )
}

type CommonProps = {
  name: string
  label: string
  help?: string
  error?: string
  optional?: boolean
  defaultValue?: string | null
  placeholder?: string
}

function describedBy(name: string, error?: string, help?: string) {
  return error ? `${name}-error` : help ? `${name}-help` : undefined
}

export function TextField({
  type = 'text',
  required,
  maxLength,
  autoComplete,
  ...props
}: CommonProps & {
  type?: 'text' | 'email' | 'url' | 'tel' | 'password'
  required?: boolean
  maxLength?: number
  autoComplete?: string
}) {
  const { name, error, help, defaultValue, placeholder } = props
  return (
    <Field {...props}>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(name, error, help)}
        className={inputClass}
      />
    </Field>
  )
}

export function TextAreaField({
  rows = 4,
  maxLength,
  ...props
}: CommonProps & { rows?: number; maxLength?: number }) {
  const { name, error, help, defaultValue, placeholder } = props
  return (
    <Field {...props}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(name, error, help)}
        className={cn(inputClass, 'resize-y leading-relaxed')}
      />
    </Field>
  )
}


/** One item per line → stored as a list. Pass the items already joined by newlines. */
export function ListField(props: CommonProps & { rows?: number }) {
  return <TextAreaField {...props} help={props.help ?? 'One item per line.'} />
}

export function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string
  label: string
  description?: string
  defaultChecked?: boolean
}) {
  return (
    <label htmlFor={name} className="flex cursor-pointer items-start justify-between gap-4">
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={name}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2"
        />
        <span
          aria-hidden="true"
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5"
        />
      </span>
    </label>
  )
}
