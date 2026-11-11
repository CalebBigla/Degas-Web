/** "11 November 2026" (or null when there is no date). */
export function formatDate(value: string | null) {
  if (!value) return null
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(value),
  )
}
