'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Globe, Languages, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LANGUAGES,
  SOURCE_LANGUAGE,
  currentLanguage,
  findLanguage,
  loadTranslator,
  setLanguage,
  suggestedLanguage,
  type Language,
} from '@/lib/translate'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const PROMPT_KEY = 'degas-language-prompt'

function shortCode(code: string) {
  return code.split('-')[0]!.toUpperCase()
}

/** Globe button in the header with a menu of languages. */
export function LanguageSwitcher() {
  const [lang, setLang] = useState(SOURCE_LANGUAGE)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [suggestion, setSuggestion] = useState<Language | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Restore a previous choice, or offer the visitor's browser language once.
  useEffect(() => {
    const saved = currentLanguage()
    setLang(saved)
    if (saved !== SOURCE_LANGUAGE) {
      void loadTranslator().catch(() => {})
      return
    }
    let seen = false
    try {
      seen = localStorage.getItem(PROMPT_KEY) !== null
    } catch {}
    const suggested = suggestedLanguage()
    if (!seen && suggested) {
      const timer = setTimeout(() => setSuggestion(suggested), 1800)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function choose(code: string) {
    setOpen(false)
    setSuggestion(null)
    try {
      localStorage.setItem(PROMPT_KEY, code)
    } catch {}
    if (code === lang) return
    setBusy(true)
    setLang(code)
    try {
      await setLanguage(code)
    } catch {
      setLang(SOURCE_LANGUAGE)
    } finally {
      setBusy(false)
    }
  }

  function dismissSuggestion() {
    setSuggestion(null)
    try {
      localStorage.setItem(PROMPT_KEY, 'dismissed')
    } catch {}
  }

  const current = findLanguage(lang)!

  return (
    <div ref={rootRef} className="notranslate relative" translate="no">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.english}. Change language`}
        className={cn(
          'inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
          open && 'bg-secondary text-foreground',
          focusRing,
        )}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
        <span>{shortCode(lang)}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <div
        className={cn(
          'absolute right-0 top-full z-50 mt-2 w-60 origin-top-right rounded-xl border border-border bg-background p-1.5 shadow-xl shadow-black/10 transition duration-150 ease-out',
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0',
        )}
      >
        <ul role="listbox" aria-label="Choose a language" className="max-h-[60vh] overflow-y-auto">
          {LANGUAGES.map((language) => {
            const selected = language.code === lang
            return (
              <li key={language.code} role="option" aria-selected={selected}>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onClick={() => choose(language.code)}
                  lang={language.code}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    selected ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                    focusRing,
                  )}
                >
                  <span className="flex flex-col">
                    <span className="font-medium text-foreground">{language.name}</span>
                    {language.code !== SOURCE_LANGUAGE && (
                      <span className="text-xs text-muted-foreground" lang="en">
                        {language.english}
                      </span>
                    )}
                  </span>
                  {selected && <Check className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-1 border-t border-border px-3 pb-1 pt-2 text-[11px] leading-snug text-muted-foreground">
          Other languages are translated automatically by Google and may not be perfect.
        </p>
      </div>

      {suggestion && (
        <LanguagePrompt language={suggestion} onAccept={() => choose(suggestion.code)} onDismiss={dismissSuggestion} />
      )}
    </div>
  )
}

/** One-time card offering the visitor's browser language. */
function LanguagePrompt({
  language,
  onAccept,
  onDismiss,
}: {
  language: Language
  onAccept: () => void
  onDismiss: () => void
}) {
  return (
    <div
      role="dialog"
      aria-label={language.prompt.question}
      lang={language.code}
      className="fixed inset-x-4 bottom-4 z-[60] animate-fade-up rounded-2xl border border-border bg-background p-4 shadow-2xl shadow-black/15 motion-reduce:animate-none sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-80"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close"
        className={cn('absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground', focusRing)}
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Languages className="h-4.5 w-4.5" />
        </span>
        <p className="pt-1.5 text-sm font-medium text-foreground">{language.prompt.question}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          className={cn('flex-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:bg-accent-hover', focusRing)}
        >
          {language.prompt.yes}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className={cn('flex-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary', focusRing)}
        >
          {language.prompt.no}
        </button>
      </div>
    </div>
  )
}
