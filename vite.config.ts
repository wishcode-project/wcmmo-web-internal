import { defineConfig, loadEnv, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { handleAuth, readCookie, verifyToken, type AuthEnv } from './api/_lib/auth.js'

/**
 * Serves /api/login|session|logout from `vite dev` and `vite preview` with the same handler Vercel
 * runs. Preview also guards /assets/team/ like middleware.ts does, so the production split can be
 * tested locally.
 */
function teamAuthDev(env: AuthEnv): Plugin {
  const guardTeamAssets: Connect.NextHandleFunction = async (req, res, next) => {
    if (await verifyToken(env, readCookie(req.headers.cookie))) return next()
    res.statusCode = 401
    res.end('Team login required')
  }
  const api = (server: { middlewares: Connect.Server }) =>
    server.middlewares.use('/api', async (req, res) => {
      const chunks: Buffer[] = []
      for await (const c of req) chunks.push(c as Buffer)
      const request = new Request(`http://${req.headers.host}${req.originalUrl}`, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
      })
      const response = await handleAuth(request, env)
      res.statusCode = response.status
      response.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(await response.text())
    })
  return {
    name: 'team-auth-dev',
    configureServer: (server) => void api(server),
    configurePreviewServer(server) {
      server.middlewares.use('/assets/team', guardTeamAssets)
      api(server)
    },
  }
}

// Everything that embeds private spec content: the team app and the synced markdown.
const isPrivate = (id: string) => id.includes('/src/team/') || (id.includes('/content/') && !id.endsWith('public-stats.json'))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'TEAM_') as AuthEnv
  return {
    plugins: [react(), tailwindcss(), teamAuthDev(env)],
    build: {
      chunkSizeWarningLimit: 1200,
      rollupOptions: {
        output: {
          // Assign every module explicitly. Rollup otherwise moves shared dependencies into the
          // `team` chunk, and the public entry would then import a file it isn't allowed to load.
          manualChunks: (id) => {
            if (id.includes('/src/team/pages/Graph')) return undefined // own lazy chunk
            if (isPrivate(id)) return 'team'
            if (/node_modules\/@xyflow|node_modules\/d3-(?:drag|selection|zoom|dispatch|interpolate|color|ease|timer|transition)|node_modules\/classcat|node_modules\/zustand/.test(id)) return 'vendor-graph'
            if (/node_modules\/(recharts|recharts-scale|victory-vendor|d3-|lodash|react-smooth|decimal\.js|eventemitter3|tiny-invariant|fast-equals|react-is|internmap|clsx)/.test(id)) return 'vendor-charts'
            if (id.includes('node_modules')) return 'vendor'
            if (id.includes('/src/') && !id.endsWith('/src/main.tsx')) return 'app' // public + shared code
            return undefined
          },
          // private chunks go under /assets/team/, which middleware.ts only serves after login
          chunkFileNames: (chunk) => (chunk.moduleIds.some(isPrivate) ? 'assets/team/[name]-[hash].js' : 'assets/[name]-[hash].js'),
          // files imported from content/ (concept boards) are team-only too
          assetFileNames: (asset) => (asset.originalFileNames.some((f) => f.includes('content/')) ? 'assets/team/[name]-[hash][extname]' : 'assets/[name]-[hash][extname]'),
        },
      },
    },
  }
})
