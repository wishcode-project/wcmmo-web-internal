import { handleAuth } from './_lib/auth'

export const POST = (request: Request) => handleAuth(request, process.env)
