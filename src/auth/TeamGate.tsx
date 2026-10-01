import { lazy, Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDict } from '../shared/i18n'
import { lazyImport } from '../shared/staleBuild'
import { Login } from './Login'
import { fetchSession, knownSession, logout, TeamSession, type SessionState } from './session'

// The team app (and the private spec data inside it) is only downloaded after login.
// In production its files live under /assets/team/, which the server refuses without a session.
// lazyImport: a tab left open across a deploy reloads itself instead of crashing.
const TeamApp = lazy(lazyImport(() => import('../team/TeamApp')))

const Loading = ({ label }: { label: string }) => (
  <div className="flex min-h-dvh items-center justify-center">
    <p className="animate-pulse font-display text-lg text-parch-dim">{label}</p>
  </div>
)

const loadingText = {
  en: { checking: 'Checking the gate…', opening: 'Opening the codex…' },
  th: { checking: 'กำลังตรวจสอบสิทธิ์…', opening: 'กำลังเปิดสมุดทีม…' },
}

export function TeamGate() {
  const lt = useDict(loadingText)
  const [state, setState] = useState<SessionState>(knownSession === null ? 'checking' : knownSession ? 'in' : 'out')
  const navigate = useNavigate()

  // keep the team area out of search engines
  useEffect(() => {
    const tag = document.createElement('meta')
    tag.name = 'robots'
    tag.content = 'noindex, nofollow'
    document.head.appendChild(tag)
    const title = document.title
    document.title = 'WC-MMO · Team codex'
    return () => {
      tag.remove()
      document.title = title
    }
  }, [])

  useEffect(() => {
    let live = true
    fetchSession().then((ok) => live && setState(ok ? 'in' : 'out'))
    return () => {
      live = false
    }
  }, [])

  const signOut = async () => {
    await logout()
    setState('out')
    navigate('/team')
  }

  if (state === 'checking') return <Loading label={lt.checking} />
  if (state === 'out') return <Login onSuccess={() => setState('in')} />
  return (
    <TeamSession.Provider value={{ signOut }}>
      <Suspense fallback={<Loading label={lt.opening} />}>
        <TeamApp />
      </Suspense>
    </TeamSession.Provider>
  )
}
