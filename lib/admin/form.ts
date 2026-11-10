/** Shared form state and FormData helpers for admin Server Actions. */

export type FormState = {
  /** Banner message shown above the form. */
  message?: string
  /** Field name → error message. */
  errors?: Record<string, string>
  /**
   * The values that were submitted. React resets forms after an action runs,
   * so failed submissions send these back to refill the fields.
   */
  values?: Record<string, string>
}

export function submittedValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {}
  formData.forEach((value, key) => {
    if (typeof value === 'string' && !key.startsWith('$ACTION')) values[key] = value
  })
  return values
}

/** Field defaults for an editor form: last submitted value, else the saved one. */
export function fieldValues(state: FormState) {
  return {
    text(name: string, saved: string | null | undefined): string {
      return state.values?.[name] ?? saved ?? ''
    },
    list(name: string, saved: string[] | undefined): string {
      return state.values?.[name] ?? (saved ?? []).join('\n')
    },
    checked(name: string, saved: boolean): boolean {
      return state.values ? state.values[name] === 'on' : saved
    },
  }
}

export const initialFormState: FormState = {}

export function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '').trim()
}

/** Empty string becomes null. */
export function optionalText(formData: FormData, name: string): string | null {
  return text(formData, name) || null
}

/** Textarea with one item per line → trimmed, non-empty lines. */
export function lines(formData: FormData, name: string): string[] {
  return text(formData, name)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function checkbox(formData: FormData, name: string): boolean {
  return formData.get(name) === 'on'
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/** Image fields hold either an uploaded (https) URL or a path in /public. */
export function isImageRef(value: string): boolean {
  return value.startsWith('/') || isHttpUrl(value)
}

/** Collects field errors; `ok` is false once any error has been added. */
export function createValidator() {
  const errors: Record<string, string> = {}
  return {
    errors,
    require(name: string, value: string, label: string) {
      if (!value) errors[name] = `${label} is required.`
    },
    maxLength(name: string, value: string | null, max: number, label: string) {
      if (value && value.length > max) errors[name] = `${label} must be ${max} characters or fewer.`
    },
    url(name: string, value: string | null, label: string) {
      if (value && !isHttpUrl(value)) errors[name] = `${label} must be a full URL starting with https://`
    },
    image(name: string, value: string | null) {
      if (value && !isImageRef(value)) errors[name] = 'Image must be uploaded or a valid URL.'
    },
    add(name: string, message: string) {
      errors[name] = message
    },
    get ok() {
      return Object.keys(errors).length === 0
    },
  }
}

export function invalid(errors: Record<string, string>, formData?: FormData): FormState {
  return {
    message: 'Please fix the highlighted fields and try again.',
    errors,
    values: formData ? submittedValues(formData) : undefined,
  }
}
