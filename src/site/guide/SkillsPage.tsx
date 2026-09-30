import { useSearchParams } from 'react-router-dom'
import { useDict, useLang } from '../../shared/i18n'
import { PixelIcon } from '../PixelIcon'
import { controls, generalSkills, laterWeapons, orbSkills, weapons, type Skill } from './data'
import { GuideTitle, Stone, Tooltip } from './parts'
import { guideUi } from './ui'

const tagColor: Record<string, string> = { 'guard-break': '#ffc94b', heavy: '#e0604c', charge: '#f08a3a', ultimate: '#c77dd9' }

function SkillCard({ s }: { s: Skill }) {
  const t = useDict(guideUi).sk
  const { lang } = useLang()
  const ult = s.tags?.includes('ultimate')
  return (
    <Tooltip title={s.name} color={ult ? '#e27ad6' : '#ffe071'} className="h-full">
      {s.mastery !== undefined && <div className="mt-0.5 text-xs text-[#88cc42]">{t.mastery(s.mastery)}</div>}
      <p className="mt-2 text-[#e8e6ee]">{s.text[lang]}</p>
      {s.tags && s.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {s.tags.map((tag) => (
            <span key={tag} className="chip" style={{ color: tagColor[tag] }}>
              {t.tags[tag]}
            </span>
          ))}
        </div>
      )}
    </Tooltip>
  )
}

export function SkillsPage() {
  const t = useDict(guideUi).sk
  const { lang } = useLang()
  const [params, setParams] = useSearchParams()
  const w = weapons.find((x) => x.id === params.get('w')) ?? weapons[0]

  return (
    <div className="flex flex-col gap-8">
      <section className="paper p-5">
        <GuideTitle>{t.controls}</GuideTitle>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((c) => (
            <li key={c.key} className="flex items-center gap-3 text-sm">
              <kbd className="min-w-14 bg-bark-dark px-2 py-1 text-center font-display text-cream shadow-[inset_0_-3px_0_rgb(0_0_0_/_0.4),0_0_0_2px_var(--color-bark)]">{c.key}</kbd>
              <span>{c.text[lang]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-paper-muted">
          <strong className="text-bark-dark">{t.slotsTitle}:</strong> {t.slotsText}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl text-cream">{t.weapons}</h2>
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={t.weapons}>
          {weapons.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={x.id === w.id}
              onClick={() => setParams({ w: x.id }, { replace: true })}
              className={`btn gap-2 px-3 py-2 ${x.id === w.id ? 'btn-leaf' : ''}`}
            >
              <PixelIcon name={x.icon} className="size-6" />
              {x.name[lang]}
            </button>
          ))}
        </div>
        <Stone>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <span className="grid size-20 place-items-center bg-black/40 shadow-[inset_0_0_0_3px_#4a4d55]">
              <PixelIcon name={w.icon} className="size-14" />
            </span>
            <div>
              <h3 className="text-2xl text-[#e8e6ee]">{w.name[lang]}</h3>
              <p className="text-[#bfc3cc]">{w.feel[lang]}</p>
              <p className="mt-1 text-xs text-[#9aa0ad]">
                {t.family[w.family]} · {t.resource[w.resource]}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {w.skills.map((s) => (
              <SkillCard key={s.name} s={s} />
            ))}
          </div>
        </Stone>
        <div className="mt-4 paper p-4">
          <h3 className="font-display text-bark-dark">{t.later}</h3>
          <p className="text-xs text-paper-muted">{t.laterNote}</p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {laterWeapons.map((x) => (
              <li key={x.name.en} className="bg-paper-light/60 px-3 py-2 text-sm shadow-[inset_0_0_0_1px_rgb(96_76_57_/_0.3)]">
                <span className="font-display text-bark-dark">{x.name[lang]}</span> <span className="text-xs text-paper-muted">· {t.family[x.family]}</span>
                <span className="block text-xs text-paper-muted">{x.feel[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="paper grid gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
        <div className="grid size-24 place-items-center justify-self-center rounded-full bg-bark-dark shadow-[0_0_0_4px_#c77dd9,0_0_24px_rgb(199_125_217_/_0.6)]">
          <span className="font-display text-3xl text-[#f3d6ff]">Q</span>
        </div>
        <div>
          <GuideTitle>{t.remnantTitle}</GuideTitle>
          <p className="text-sm leading-relaxed">{t.remnantText}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl text-cream">{t.general}</h2>
        <p className="mb-3 text-sm text-parch-dim">{t.generalText}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {generalSkills.map((s) => (
            <Tooltip key={s.name} title={s.name} color="#8fd14f" className="h-full">
              <p className="mt-1 text-xs text-[#e8e6ee]">{s.text[lang]}</p>
            </Tooltip>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl text-cream">{t.orbs}</h2>
        <p className="mb-3 text-sm text-parch-dim">{t.orbsText}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {orbSkills.map((s) => (
            <Tooltip
              key={s.name}
              title={
                <span className="flex items-center gap-2">
                  <PixelIcon name="orb" className="size-6" />
                  {s.name}
                </span>
              }
              color="#5fb4ea"
              className="h-full"
            >
              <div className="mt-1 text-xs text-[#88cc42]">
                {t.usableWith}: {s.who[lang]}
              </div>
              <p className="mt-2 text-[#e8e6ee]">{s.text[lang]}</p>
            </Tooltip>
          ))}
        </div>
      </section>
    </div>
  )
}
