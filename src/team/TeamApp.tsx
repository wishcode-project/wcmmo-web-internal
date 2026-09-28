import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDict } from '../shared/i18n'
import { strings } from './strings'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Decisions } from './pages/Decisions'
import { Library, ReadDoc } from './pages/Library'
import { NotFound } from './pages/NotFound'
import { Plugins } from './pages/Plugins'
import { Questions } from './pages/Questions'
import { Roadmap } from './pages/Roadmap'
import { SpecDetail } from './pages/SpecDetail'
import { Specs } from './pages/Specs'

// React Flow is only needed on the graph page, so keep it out of the main team chunk.
const Graph = lazy(() => import('./pages/Graph').then((m) => ({ default: m.Graph })))
const GraphFallback = () => <p className="py-16 text-center font-display text-parch-dim">{useDict(strings).graph.loading}</p>

/** Rendered under /team/* once the TeamGate has a session. */
export default function TeamApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="specs" element={<Specs />} />
        <Route path="specs/:id" element={<SpecDetail />} />
        <Route
          path="graph"
          element={
            <Suspense fallback={<GraphFallback />}>
              <Graph />
            </Suspense>
          }
        />
        <Route path="decisions" element={<Decisions />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="questions" element={<Questions />} />
        <Route path="plugins" element={<Plugins />} />
        <Route path="read" element={<Library />} />
        <Route path="read/*" element={<ReadDoc />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
