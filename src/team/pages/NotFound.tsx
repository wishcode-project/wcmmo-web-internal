import { Link } from 'react-router-dom'
import { useDict } from '../../shared/i18n'
import { strings } from '../strings'

export function NotFound() {
  const t = useDict(strings).notFound
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="font-display text-7xl text-gold drop-shadow-[0_4px_0_#000]">404</p>
      <h1 className="mt-3 text-2xl text-cream">{t.title}</h1>
      <p className="mt-2 text-parch-dim">{t.body}</p>
      <Link to="/team" className="btn btn-leaf mt-6">
        ◀ {t.back}
      </Link>
    </div>
  )
}
