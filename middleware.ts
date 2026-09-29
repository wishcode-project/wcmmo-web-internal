// Vercel Routing Middleware: the team tracker's JavaScript (which embeds the private specs) is
// emitted under /assets/team/ (see vite.config.ts) and only served with a valid team session.
// Public pages and their assets are untouched.
import { next } from '@vercel/functions'
import { readCookie, verifyToken } from './api/_lib/auth.js'

export const config = { matcher: ['/assets/team/:path*'] }

export default async function middleware(request: Request) {
  const ok = await verifyToken(process.env, readCookie(request.headers.get('cookie')))
  if (ok) return next({ headers: { 'cache-control': 'private, no-store' } })
  return new Response('Team login required', { status: 401, headers: { 'cache-control': 'no-store' } })
}
