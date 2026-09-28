import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { HeroArt } from '../shared/HeroArt'
import { LangSwitch, useDict } from '../shared/i18n'
import { login } from './session'

const text = {
  en: { title: 'Team login', intro: 'The spec tracker is for the dev team only.', user: 'Username', pass: 'Password', enter: 'Enter', busy: 'Opening…', back: 'Back to the public site', wrong: 'Wrong username or password', offline: 'Could not reach the server' },
  th: { title: 'เข้าสู่ระบบทีมงาน', intro: 'ระบบติดตามสเปกนี้สำหรับทีมพัฒนาเท่านั้น', user: 'ชื่อผู้ใช้', pass: 'รหัสผ่าน', enter: 'เข้าสู่ระบบ', busy: 'กำลังเปิด…', back: 'กลับไปเว็บไซต์หลัก', wrong: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', offline: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' },
}

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const t = useDict(text)
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await login(user.trim(), password)
    setBusy(false)
    if (r.ok) onSuccess()
    else setError(r.status === 401 ? t.wrong : r.status === 0 ? t.offline : r.error)
  }

  const field = 'mt-1 w-full border-2 border-bark bg-paper-lighter/70 px-3 py-2 text-paper-text focus:border-leaf-dark focus:outline-none'

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <HeroArt className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-night/60" />
      <form onSubmit={submit} className="paper relative w-full max-w-sm p-7" aria-labelledby="login-title">
        <div className="flex items-center justify-between">
          <p className="font-display text-sm tracking-widest text-bark uppercase">WC-MMO Codex</p>
          <LangSwitch />
        </div>
        <h1 id="login-title" className="text-3xl text-bark-dark">
          {t.title}
        </h1>
        <p className="mt-1 text-sm text-paper-muted">{t.intro}</p>

        <label className="mt-5 block text-sm font-medium">
          {t.user}
          <input className={field} value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" autoFocus required />
        </label>
        <label className="mt-3 block text-sm font-medium">
          {t.pass}
          <input className={field} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </label>

        {error && (
          <p role="alert" className="mt-3 border-l-4 border-st-fail bg-st-fail/15 px-3 py-2 text-sm text-[#6b1616]">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-leaf mt-5 w-full justify-center py-2 text-base" disabled={busy}>
          {busy ? t.busy : `▶ ${t.enter}`}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-paper-muted underline hover:text-bark-dark">
          ◀ {t.back}
        </Link>
      </form>
    </div>
  )
}
