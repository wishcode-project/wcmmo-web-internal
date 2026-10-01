import { useRouteError } from 'react-router-dom'
import { useDict } from './i18n'

// Every deploy renames the code-split files (content hashes). A tab left open across a deploy
// still points at the old names, so its next lazy import 404s. The fix is a fresh page load,
// done for the user once; a second failure in the same session shows the error page instead.
const KEY = 'wcmmo-reloaded-for-build'

export function isChunkLoadError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err)
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to fetch/i.test(msg)
}

/** Reload once per session; returns true if a reload was started. */
export function reloadForNewBuild(): boolean {
  try {
    if (sessionStorage.getItem(KEY)) return false
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // Without storage we can't remember that we already reloaded, and reloading anyway could
    // loop forever. Show the error page instead.
    return false
  }
  window.location.reload()
  return true
}

/** Call after a lazy chunk loaded fine, so a later deploy gets its own one-time reload. */
export function clearReloadFlag() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* not critical */
  }
}

/** `import()` wrapper for React.lazy: on a stale build, reload instead of crashing. */
export function lazyImport<T>(load: () => Promise<T>): () => Promise<T> {
  return () =>
    load().then(
      (mod) => {
        // When the vite:preloadError handler starts a reload it suppresses the error, and the
        // import resolves to undefined. That is "reloading", not success: keep the flag and wait.
        if (mod == null) return new Promise<T>(() => undefined)
        clearReloadFlag()
        return mod
      },
      (err) => {
        if (isChunkLoadError(err) && reloadForNewBuild()) return new Promise<T>(() => undefined) // page is reloading
        throw err
      },
    )
}

const text = {
  en: {
    title: 'Something went wrong',
    stale: 'The site was updated while this page was open. Reload to get the new version.',
    other: 'This page hit an error. Reloading usually fixes it; if not, sign out and in again.',
    reload: 'Reload',
    home: 'Back to the site',
  },
  th: {
    title: 'เกิดข้อผิดพลาด',
    stale: 'เว็บถูกอัปเดตระหว่างที่หน้านี้เปิดอยู่ กดโหลดใหม่เพื่อใช้เวอร์ชันล่าสุด',
    other: 'หน้านี้เกิดข้อผิดพลาด ปกติโหลดใหม่ก็หาย ถ้ายังไม่หาย ลองออกจากระบบแล้วเข้าใหม่',
    reload: 'โหลดใหม่',
    home: 'กลับไปหน้าเว็บ',
  },
}

/** Route errorElement: a readable page instead of React Router's developer screen. */
export function RouteError() {
  const err = useRouteError()
  const t = useDict(text)
  const stale = isChunkLoadError(err)
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="paper w-full max-w-md p-7 text-center">
        <p className="font-display text-5xl text-bark-dark">⚠</p>
        <h1 className="mt-2 text-2xl text-bark-dark">{t.title}</h1>
        <p className="mt-2 text-sm text-paper-muted">{stale ? t.stale : t.other}</p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            className="btn btn-leaf"
            onClick={() => {
              clearReloadFlag()
              window.location.reload()
            }}
          >
            ↻ {t.reload}
          </button>
          <a href="/" className="btn">
            {t.home}
          </a>
        </div>
      </div>
    </div>
  )
}
