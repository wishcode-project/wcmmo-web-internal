import { handleAuth } from './_lib/auth'

export const GET = (request: Request) => handleAuth(request, process.env)
