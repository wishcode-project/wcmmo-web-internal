import { createContext, useContext } from 'react'

export type SessionState = 'checking' | 'in' | 'out'

// Remembered for the page's lifetime so a language switch (which remounts the tree) doesn't
// flash the "checking" screen again.
export let knownSession: boolean | null = null

export async function fetchSession(): Promise<boolean> {
  knownSession = await querySession()
  return knownSession
}

async function querySession(): Promise<boolean> {
  try {
    const r = await fetch('/api/session', { credentials: 'same-origin', cache: 'no-store' })
    if (!r.ok) return false
    const body = (await r.json()) as { authenticated?: unknown }
    return body.authenticated === true
  } catch {
    return false
  }
}

export async function login(user: string, password: string): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  try {
    const r = await fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user, password }),
    })
    if (r.ok) {
      knownSession = true
      return { ok: true }
    }
    const body = (await r.json().catch(() => ({}))) as { error?: string }
    return { ok: false, status: r.status, error: body.error ?? `Login failed (${r.status})` }
  } catch {
    return { ok: false, status: 0, error: 'Could not reach the server' }
  }
}

export async function logout() {
  knownSession = false
  await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined)
}

export const TeamSession = createContext<{ signOut: () => void }>({ signOut: () => undefined })
export const useTeamSession = () => useContext(TeamSession)
