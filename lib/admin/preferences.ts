/** Admin UI preferences stored in cookies, so the server renders them without a flash. */

export type Theme = 'light' | 'dark' | 'system'

export const THEME_COOKIE = 'admin-theme'
export const SIDEBAR_COOKIE = 'admin-sidebar'

export function parseTheme(value: string | undefined): Theme {
  return value === 'light' || value === 'dark' ? value : 'system'
}

/** Client only: remember a preference for a year. */
export function savePreference(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/admin; max-age=31536000; samesite=lax`
}
