'use client'

import Link from 'next/link'
import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ExternalLink, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { savePage } from '@/lib/admin/actions'
import { initialFormState } from '@/lib/admin/form'
import {
  fieldMax,
  TOKENS,
  type FieldDef,
  type GroupItem,
  type PageDef,
  type PageValue,
  type SubField,
} from '@/lib/pages/definitions'
import { cn } from '@/lib/utils'
import { buttonClass, Card } from '@/components/admin/ui'
import { Field, inputClass } from '@/components/admin/fields'
import { FormAlert, SubmitButton } from '@/components/admin/form-controls'

/** Editor state: list fields are edited as newline-joined text. */
type EditorValue = string | boolean | GroupItem[]
type Values = Record<string, EditorValue>

function toEditor(field: FieldDef, value: PageValue): EditorValue {
  if (field.kind === 'list') return (value as string[]).join('\n')
  return value as EditorValue
}

function fromEditor(field: FieldDef, value: EditorValue): PageValue {
  if (field.kind === 'list') {
    return String(value)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }
  return value as PageValue
}

function rowsFor(kind: string, value: string) {
  if (kind === 'text') return 1
  const base = kind === 'richtext' ? 6 : 3
  return Math.min(Math.max(base, value.split('\n').length + 1, Math.ceil(value.length / 90)), 18)
}

function TextInput({
  id,
  kind,
  value,
  max,
  error,
  onChange,
}: {
  id: string
  kind: string
  value: string
  max: number
  error?: string
  onChange: (value: string) => void
}) {
  const shared = {
    id,
    value,
    maxLength: max,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : `${id}-help`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
  }
  if (kind === 'text') return <input type="text" {...shared} className={inputClass} />
  return (
    <textarea
      {...shared}
      rows={rowsFor(kind, value)}
      className={cn(inputClass, 'resize-y leading-relaxed', kind === 'richtext' && 'font-mono text-[13px]')}
    />
  )
}

const RICH_HELP = 'Blank line = new paragraph · "- " = bullet · **bold** · [link text](/page or https://…)'

function SubFieldInput({
  id,
  sub,
  value,
  error,
  onChange,
}: {
  id: string
  sub: SubField
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <Field name={id} label={sub.label} error={error} help={sub.kind === 'richtext' ? RICH_HELP : sub.help}>
      <TextInput id={id} kind={sub.kind} value={value} max={fieldMax(sub)} error={error} onChange={onChange} />
    </Field>
  )
}

function GroupEditor({
  field,
  items,
  errors,
  onChange,
}: {
  field: Extract<FieldDef, { kind: 'group' }>
  items: GroupItem[]
  errors: Record<string, string>
  onChange: (items: GroupItem[]) => void
}) {
  const max = field.maxItems ?? 50
  const min = field.minItems ?? 0
  const blank = () => Object.fromEntries(field.fields.map((sub) => [sub.key, '']))

  const update = (index: number, key: string, value: string) =>
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  const move = (index: number, delta: number) => {
    const next = [...items]
    const target = index + delta
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? field.itemLabel.toLowerCase() : `${field.itemLabel.toLowerCase()}s`}
        </span>
      </div>
      {errors[field.key] && <p className="text-xs text-destructive">{errors[field.key]}</p>}

      <ol className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="rounded-lg border border-border bg-secondary/40">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
              <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {field.itemLabel} {index + 1}
                {item[field.fields[0]!.key] && (
                  <span className="ml-2 font-normal normal-case tracking-normal text-foreground">
                    {item[field.fields[0]!.key]}
                  </span>
                )}
              </span>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1.5 text-muted-foreground hover:bg-card hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${field.itemLabel.toLowerCase()} ${index + 1} up`}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded p-1.5 text-muted-foreground hover:bg-card hover:text-foreground disabled:opacity-30"
                  aria-label={`Move ${field.itemLabel.toLowerCase()} ${index + 1} down`}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove ${field.itemLabel.toLowerCase()} ${index + 1}?`))
                      onChange(items.filter((_, i) => i !== index))
                  }}
                  disabled={items.length <= min}
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                  aria-label={`Remove ${field.itemLabel.toLowerCase()} ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
              {field.fields.map((sub) => {
                const id = `${field.key}.${index}.${sub.key}`
                return (
                  <SubFieldInput
                    key={sub.key}
                    id={id}
                    sub={sub}
                    value={item[sub.key] ?? ''}
                    error={errors[id]}
                    onChange={(value) => update(index, sub.key, value)}
                  />
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, blank()])}
          className={cn(buttonClass('secondary'), 'self-start')}
        >
          <Plus className="h-4 w-4" />
          Add {field.itemLabel.toLowerCase()}
        </button>
      )}
    </div>
  )
}

export function PageEditor({
  slug,
  definition,
  initial,
  defaults,
}: {
  slug: string
  definition: PageDef
  /** Current content (saved values over defaults), placeholders not filled in. */
  initial: Record<string, PageValue>
  defaults: Record<string, PageValue>
}) {
  const fields = useMemo(() => definition.sections.flatMap((s) => s.fields), [definition])
  const save = useMemo(() => savePage.bind(null, slug), [slug])
  const [state, action] = useActionState(save, initialFormState)
  const errors = state.errors ?? {}

  const initialValues = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.key, toEditor(f, initial[f.key]!)])) as Values,
    [fields, initial],
  )
  const [values, setValues] = useState<Values>(initialValues)
  const set = (key: string, value: EditorValue) => setValues((v) => ({ ...v, [key]: value }))

  const dirty = JSON.stringify(values) !== JSON.stringify(initialValues)
  const submitting = useRef(false)

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (submitting.current) return
      event.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // Jump to the first problem after a failed save.
  useEffect(() => {
    submitting.current = false
    const first = Object.keys(state.errors ?? {})[0]
    if (first) document.getElementById(first)?.focus()
  }, [state])

  const content = JSON.stringify(
    Object.fromEntries(fields.map((f) => [f.key, fromEditor(f, values[f.key]!)])),
  )

  const isDefault = (field: FieldDef) =>
    JSON.stringify(values[field.key]) === JSON.stringify(toEditor(field, defaults[field.key]!))

  return (
    <form
      action={action}
      onSubmit={() => {
        submitting.current = true
      }}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]"
    >
      <input type="hidden" name="content" value={content} />

      <div className="flex min-w-0 flex-col gap-6">
        <FormAlert state={state} />

        {definition.sections.map((section) => (
          <div key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
            <Card title={section.title} description={section.description}>
              <div className="flex flex-col gap-5">
                {section.fields.map((field) => {
                  const value = values[field.key]!
                  const reset = !isDefault(field) && (
                    <button
                      type="button"
                      onClick={() => set(field.key, toEditor(field, defaults[field.key]!))}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                      title="Restore the original text"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  )

                  if (field.kind === 'group') {
                    return (
                      <div key={field.key} className="flex flex-col gap-2">
                        <GroupEditor
                          field={field}
                          items={value as GroupItem[]}
                          errors={errors}
                          onChange={(items) => set(field.key, items)}
                        />
                        {reset && <div className="self-end">{reset}</div>}
                      </div>
                    )
                  }

                  if (field.kind === 'toggle') {
                    return (
                      <label key={field.key} className="flex cursor-pointer items-center justify-between gap-4">
                        <span className="text-sm font-medium text-foreground">{field.label}</span>
                        <span className="relative inline-flex shrink-0">
                          <input
                            id={field.key}
                            type="checkbox"
                            checked={Boolean(value)}
                            onChange={(e) => set(field.key, e.target.checked)}
                            className="peer sr-only"
                          />
                          <span aria-hidden="true" className="h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2" />
                          <span aria-hidden="true" className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                        </span>
                      </label>
                    )
                  }

                  const text = String(value)
                  const help =
                    field.kind === 'richtext'
                      ? RICH_HELP
                      : field.kind === 'list'
                        ? (field.help ?? 'One item per line.')
                        : field.help
                  return (
                    <div key={field.key} className="flex flex-col gap-1">
                      <Field
                        name={field.key}
                        label={field.label}
                        optional={!field.required && field.kind !== 'list'}
                        error={errors[field.key]}
                        help={help}
                      >
                        <TextInput
                          id={field.key}
                          kind={field.kind === 'list' ? 'textarea' : field.kind}
                          value={text}
                          max={field.kind === 'list' ? fieldMax(field) * 50 : fieldMax(field)}
                          error={errors[field.key]}
                          onChange={(next) => set(field.key, next)}
                        />
                      </Field>
                      {reset && <div className="self-end">{reset}</div>}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        ))}
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <SubmitButton className="w-full">Save changes</SubmitButton>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {dirty ? 'You have unsaved changes.' : 'Saving publishes immediately.'}
          </p>
          {definition.path && (
            <Link
              href={definition.path}
              target="_blank"
              className={cn(buttonClass('ghost'), 'mt-3 w-full')}
            >
              <ExternalLink className="h-4 w-4" />
              View page
            </Link>
          )}
        </div>

        <nav aria-label="Sections" className="hidden rounded-xl border border-border bg-card p-5 shadow-sm lg:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
          <ul className="mt-3 flex flex-col gap-1">
            {definition.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#section-${section.id}`}
                  className="block rounded px-2 py-1 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Placeholders</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Type these anywhere; they are replaced with your Company info.
          </p>
          <dl className="mt-3 flex flex-col gap-1.5 text-xs">
            {TOKENS.map(([token, label]) => (
              <div key={token} className="flex justify-between gap-2">
                <dt className="font-mono text-foreground">{token}</dt>
                <dd className="text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </form>
  )
}
