import { handleAuth } from './_lib/auth.js'

export const GET = (request: Request) => handleAuth(request, process.env)
