import { createContext, Fragment, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'th'
export type Dict<T> = { en: T; th: T }

const KEY = 'wcmmo-lang'

function initialLang(): Lang {
  // ?lang=th in the URL wins, so a Thai link can be shared directly
  const fromUrl = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('lang') : null
  if (fromUrl === 'en' || fromUrl === 'th') return fromUrl
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'th') return saved
  } catch {
    /* storage blocked: fall through to the browser language */
  }
  return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('th') ? 'th' : 'en'
}

/** Current language for non-React helpers (date formatting). Set by LangProvider before children render. */
export let currentLang: Lang = 'en'

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'en', setLang: () => undefined })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  currentLang = lang

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* not critical */
    }
  }, [lang])

  // Remount the tree on switch so every string and date re-renders in the new language.
  // URL state (filters, route) survives; the router lives outside this tree.
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <Fragment key={lang}>{children}</Fragment>
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)

/** Pick this language's half of a `{ en, th }` dictionary. */
export function useDict<T>(dict: Dict<T>): T {
  return dict[useLang().lang]
}

export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Language / ภาษา" className={`inline-flex shadow-[0_0_0_2px_var(--color-bark-dark)] ${className}`}>
      {(['en', 'th'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          title={l === 'en' ? 'English' : 'ภาษาไทย'}
          className={`px-2 py-1 font-display text-xs transition-colors ${lang === l ? 'bg-leaf text-[#10200a]' : 'bg-bark text-paper-light hover:text-cream'}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
