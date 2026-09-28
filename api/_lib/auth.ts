// Team session tokens, shared by the /api functions, the Vercel middleware and the Vite dev server.
// Token = "<expiry>.<hmac>", HMAC-SHA256 over the user and expiry, keyed by TEAM_SESSION_SECRET
// (falls back to TEAM_PASSWORD, so changing the password logs everyone out).

export const COOKIE = 'wcmmo_team'
const MAX_AGE_S = 7 * 24 * 3600

export interface AuthEnv {
  TEAM_USER?: string
  TEAM_PASSWORD?: string
  TEAM_SESSION_SECRET?: string
}

export const isConfigured = (env: AuthEnv) => Boolean(env.TEAM_USER && env.TEAM_PASSWORD)

const enc = new TextEncoder()

const b64url = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

async function hmac(env: AuthEnv, message: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(env.TEAM_SESSION_SECRET || env.TEAM_PASSWORD || ''), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(message)))
}

/** Constant-time string compare, so a wrong guess can't be timed character by character. */
export function safeEqual(a: string, b: string) {
  const x = enc.encode(a)
  const y = enc.encode(b)
  let diff = x.length ^ y.length
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0)
  return diff === 0
}

export async function checkLogin(env: AuthEnv, user: string, password: string) {
  if (!isConfigured(env)) return false
  // evaluate both so the response time doesn't reveal which field was wrong
  const okUser = safeEqual(user, env.TEAM_USER!)
  const okPass = safeEqual(password, env.TEAM_PASSWORD!)
  return okUser && okPass
}

export async function createToken(env: AuthEnv, now = Date.now()) {
  const exp = Math.floor(now / 1000) + MAX_AGE_S
  return `${exp}.${await hmac(env, `${env.TEAM_USER}:${exp}`)}`
}

export async function verifyToken(env: AuthEnv, token: string | undefined, now = Date.now()) {
  if (!token || !isConfigured(env)) return false
  const [expStr, sig] = token.split('.')
  const exp = Number(expStr)
  if (!sig || !Number.isFinite(exp) || exp * 1000 < now) return false
  return safeEqual(sig, await hmac(env, `${env.TEAM_USER}:${exp}`))
}

export function readCookie(header: string | null | undefined, name = COOKIE) {
  for (const part of (header ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return undefined
}

export const sessionCookie = (token: string, secure: boolean) =>
  `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_S}${secure ? '; Secure' : ''}`

export const clearCookie = (secure: boolean) => `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } })

/** The three endpoints as plain Request → Response handlers, so dev and prod share them. */
export async function handleAuth(request: Request, env: AuthEnv): Promise<Response> {
  const url = new URL(request.url)
  const secure = url.protocol === 'https:'
  const route = url.pathname.replace(/\/+$/, '')

  if (route === '/api/session' && request.method === 'GET') {
    const ok = await verifyToken(env, readCookie(request.headers.get('cookie')))
    return json({ authenticated: ok, configured: isConfigured(env) }, ok ? 200 : 401)
  }

  if (route === '/api/login' && request.method === 'POST') {
    if (!isConfigured(env)) return json({ error: 'Team login is not configured on the server (TEAM_USER / TEAM_PASSWORD).' }, 503)
    let body: { user?: unknown; password?: unknown } = {}
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Bad request' }, 400)
    }
    const ok = await checkLogin(env, String(body.user ?? ''), String(body.password ?? ''))
    if (!ok) return json({ error: 'Wrong username or password' }, 401)
    return json({ authenticated: true }, 200, { 'set-cookie': sessionCookie(await createToken(env), secure) })
  }

  if (route === '/api/logout' && request.method === 'POST') {
    return json({ authenticated: false }, 200, { 'set-cookie': clearCookie(secure) })
  }

  return json({ error: 'Not found' }, 404)
}
