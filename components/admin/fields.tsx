import { cn } from '@/lib/utils'

export const inputClass =
  'w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.04)] outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/60 hover:border-foreground/25 focus:border-accent focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_18%,transparent)] aria-invalid:border-destructive aria-invalid:focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--destructive)_15%,transparent)]'

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
        <p id={`${name}-error`} className="animate-page-in text-xs font-medium text-destructive">
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
          className="h-6 w-11 rounded-full bg-input transition-colors duration-300 peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
        />
        <span
          aria-hidden="true"
          className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] peer-checked:translate-x-5 peer-active:w-6 peer-checked:peer-active:translate-x-4"
        />
      </span>
    </label>
  )
}
