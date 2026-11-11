/**
 * Machine translation of the public site (browser only).
 *
 * Uses Google's website translator under the hood, but with our own picker:
 * the hidden Google widget reads the `googtrans` cookie ("/en/fr") and
 * translates the page, including content that appears after client-side
 * navigation. English is the source language, so "en" means "no translation".
 */

export type Language = {
  code: string
  /** Name in the language itself. */
  name: string
  /** Name in English, shown as a hint. */
  english: string
  /** Strings for the "view this site in …?" suggestion. */
  prompt: { question: string; yes: string; no: string }
}

export const SOURCE_LANGUAGE = 'en'

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', english: 'English', prompt: { question: 'View this site in English?', yes: 'Switch', no: 'No thanks' } },
  { code: 'fr', name: 'Français', english: 'French', prompt: { question: 'Voir ce site en français ?', yes: 'Traduire', no: 'Non merci' } },
  { code: 'es', name: 'Español', english: 'Spanish', prompt: { question: '¿Ver este sitio en español?', yes: 'Traducir', no: 'No, gracias' } },
  { code: 'pt', name: 'Português', english: 'Portuguese', prompt: { question: 'Ver este site em português?', yes: 'Traduzir', no: 'Não, obrigado' } },
  { code: 'de', name: 'Deutsch', english: 'German', prompt: { question: 'Diese Seite auf Deutsch anzeigen?', yes: 'Übersetzen', no: 'Nein, danke' } },
  { code: 'it', name: 'Italiano', english: 'Italian', prompt: { question: 'Visualizzare questo sito in italiano?', yes: 'Traduci', no: 'No, grazie' } },
  { code: 'nl', name: 'Nederlands', english: 'Dutch', prompt: { question: 'Deze site in het Nederlands bekijken?', yes: 'Vertalen', no: 'Nee, bedankt' } },
  { code: 'ar', name: 'العربية', english: 'Arabic', prompt: { question: 'عرض هذا الموقع باللغة العربية؟', yes: 'ترجمة', no: 'لا، شكرًا' } },
  { code: 'zh-CN', name: '中文', english: 'Chinese', prompt: { question: '以中文查看本网站？', yes: '翻译', no: '不用了' } },
  { code: 'ja', name: '日本語', english: 'Japanese', prompt: { question: 'このサイトを日本語で表示しますか？', yes: '翻訳する', no: 'いいえ' } },
  { code: 'ko', name: '한국어', english: 'Korean', prompt: { question: '이 사이트를 한국어로 보시겠습니까?', yes: '번역', no: '아니요' } },
  { code: 'hi', name: 'हिन्दी', english: 'Hindi', prompt: { question: 'यह साइट हिन्दी में देखें?', yes: 'अनुवाद करें', no: 'नहीं, धन्यवाद' } },
  { code: 'sw', name: 'Kiswahili', english: 'Swahili', prompt: { question: 'Tazama tovuti hii kwa Kiswahili?', yes: 'Tafsiri', no: 'Hapana, asante' } },
]

export function findLanguage(code: string | null | undefined) {
  return LANGUAGES.find((l) => l.code === code)
}

/** Best supported match for the visitor's browser languages, if not English. */
export function suggestedLanguage(): Language | undefined {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const lower = tag.toLowerCase()
    if (lower.startsWith('en')) return undefined
    const match =
      LANGUAGES.find((l) => l.code.toLowerCase() === lower) ??
      LANGUAGES.find((l) => l.code.split('-')[0] === lower.split('-')[0])
    if (match) return match
  }
  return undefined
}

const COOKIE = 'googtrans'

/** The language the page is (or will be) translated to. */
export function currentLanguage(): string {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/)
  const code = match ? decodeURIComponent(match[1]!) : SOURCE_LANGUAGE
  return findLanguage(code) ? code : SOURCE_LANGUAGE
}

/** Cookie domains to write: this host, plus the parent domain Google also checks. */
function cookieDomains() {
  const host = location.hostname
  const domains = ['']
  if (host.includes('.') && !/^[\d.]+$/.test(host)) {
    domains.push(`; domain=.${host}`)
    const parent = host.split('.').slice(-2).join('.')
    if (parent !== host) domains.push(`; domain=.${parent}`)
  }
  return domains
}

function writeCookie(code: string | null) {
  for (const domain of cookieDomains()) {
    document.cookie = code
      ? `${COOKIE}=/${SOURCE_LANGUAGE}/${code}; path=/; max-age=31536000; samesite=lax${domain}`
      : `${COOKIE}=; path=/; max-age=0${domain}`
  }
}

type GoogleTranslate = {
  translate: {
    TranslateElement: new (options: Record<string, unknown>, id: string) => unknown
  }
}

declare global {
  interface Window {
    google?: GoogleTranslate
    __degasTranslateInit?: () => void
  }
}

const ELEMENT_ID = 'google_translate_element'
let loading: Promise<void> | null = null

/**
 * Google's translator wraps text in <font> elements, which React does not
 * expect. Make removeChild/insertBefore tolerant so re-renders don't crash.
 */
function patchDomForReact() {
  const proto = Node.prototype as Node & { __degasPatched?: boolean }
  if (proto.__degasPatched) return
  proto.__degasPatched = true

  const removeChild = proto.removeChild
  proto.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child
    return removeChild.call(this, child) as T
  }
  const insertBefore = proto.insertBefore
  proto.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node
    return insertBefore.call(this, node, ref) as T
  }
}

/** Loads Google's translator once. It applies the cookie's language on init. */
export function loadTranslator(): Promise<void> {
  if (loading) return loading
  patchDomForReact()

  loading = new Promise((resolve, reject) => {
    if (!document.getElementById(ELEMENT_ID)) {
      const holder = document.createElement('div')
      holder.id = ELEMENT_ID
      holder.setAttribute('aria-hidden', 'true')
      document.body.appendChild(holder)
    }
    window.__degasTranslateInit = () => {
      new window.google!.translate.TranslateElement(
        {
          pageLanguage: SOURCE_LANGUAGE,
          includedLanguages: LANGUAGES.map((l) => l.code).join(','),
          autoDisplay: false,
        },
        ELEMENT_ID,
      )
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://translate.google.com/translate_a/element.js?cb=__degasTranslateInit'
    script.async = true
    script.onerror = () => {
      loading = null
      reject(new Error('Could not load the translator'))
    }
    document.body.appendChild(script)
  })
  return loading
}

/** Switch the page language. English reloads the original page. */
export async function setLanguage(code: string) {
  if (code === SOURCE_LANGUAGE) {
    writeCookie(null)
    location.reload()
    return
  }
  writeCookie(code)

  await loadTranslator()
  // Drive Google's hidden select; it appears shortly after the widget initialises.
  for (let tries = 0; tries < 40; tries++) {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (combo && combo.options.length > 1) {
      if (combo.value !== code) {
        combo.value = code
        combo.dispatchEvent(new Event('change'))
      }
      return
    }
    await new Promise((r) => setTimeout(r, 100))
  }
}
