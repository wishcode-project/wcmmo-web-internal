import { handleAuth } from './_lib/auth.js'

export const POST = (request: Request) => handleAuth(request, process.env)
