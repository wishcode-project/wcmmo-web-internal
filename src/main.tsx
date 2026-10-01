import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import { TeamGate } from './auth/TeamGate'
import { LangProvider } from './shared/i18n'
import { reloadForNewBuild, RouteError } from './shared/staleBuild'
import { Home } from './site/Home'
import { Devlog, DevlogPost, Features, Lore, LoreChapter, PublicNotFound, PublicRoadmap } from './site/pages'
import { BloodlinesPage } from './site/guide/BloodlinesPage'
import { GuideLayout } from './site/guide/parts'
import { ItemsPage } from './site/guide/ItemsPage'
import { RunesPage } from './site/guide/RunesPage'
import { SkillsPage } from './site/guide/SkillsPage'
import { StatsPage } from './site/guide/StatsPage'
import { PublicLayout } from './site/PublicLayout'

// Public player site at /, team spec tracker behind a login at /team.
// Nothing under src/team (or the synced spec markdown) may be imported from the public side:
// it's code-split into /assets/team/, which the server only serves to a logged-in team member.
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/features', element: <Features /> },
      {
        path: '/guide',
        element: <GuideLayout />,
        children: [
          { index: true, element: <Navigate to="/guide/bloodlines" replace /> },
          { path: 'bloodlines', element: <BloodlinesPage /> },
          { path: 'skills', element: <SkillsPage /> },
          { path: 'runes', element: <RunesPage /> },
          { path: 'items', element: <ItemsPage /> },
          { path: 'stats', element: <StatsPage /> },
        ],
      },
      { path: '/roadmap', element: <PublicRoadmap /> },
      { path: '/lore', element: <Lore /> },
      { path: '/lore/:slug', element: <LoreChapter /> },
      { path: '/devlog', element: <Devlog /> },
      { path: '/devlog/:slug', element: <DevlogPost /> },
      { path: '*', element: <PublicNotFound /> },
    ],
  },
  { path: '/team/*', element: <TeamGate />, errorElement: <RouteError /> },
])

// Vite fires this when a preloaded chunk/CSS of an old build is gone: reload once.
window.addEventListener('vite:preloadError', (e) => {
  if (reloadForNewBuild()) e.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <RouterProvider router={router} />
    </LangProvider>
  </StrictMode>,
)
