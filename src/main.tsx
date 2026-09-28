import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { TeamGate } from './auth/TeamGate'
import { LangProvider } from './shared/i18n'
import { Home } from './site/Home'
import { Devlog, DevlogPost, Features, PublicNotFound, PublicRoadmap } from './site/pages'
import { PublicLayout } from './site/PublicLayout'

// Public player site at /, team spec tracker behind a login at /team.
// Nothing under src/team (or the synced spec markdown) may be imported from the public side:
// it's code-split into /assets/team/, which the server only serves to a logged-in team member.
const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/features', element: <Features /> },
      { path: '/roadmap', element: <PublicRoadmap /> },
      { path: '/devlog', element: <Devlog /> },
      { path: '/devlog/:slug', element: <DevlogPost /> },
      { path: '*', element: <PublicNotFound /> },
    ],
  },
  { path: '/team/*', element: <TeamGate /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <RouterProvider router={router} />
    </LangProvider>
  </StrictMode>,
)
