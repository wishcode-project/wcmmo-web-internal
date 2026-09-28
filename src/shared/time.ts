import { currentLang } from './i18n'

const DAY = 86_400_000

const locale = () => (currentLang === 'th' ? 'th-TH' : 'en-GB')

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const daysBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY)

export const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' })

export const fmtShort = (d: Date | string) => new Date(d).toLocaleDateString(locale(), { day: 'numeric', month: 'short' })

export function timeAgo(iso: string | null | undefined, now = new Date()) {
  const th = currentLang === 'th'
  if (!iso) return th ? 'ไม่ทราบ' : 'unknown'
  const s = Math.round((now.getTime() - new Date(iso).getTime()) / 1000)
  if (s < 60) return th ? 'เมื่อสักครู่' : 'just now'
  if (s < 3600) return th ? `${Math.floor(s / 60)} นาทีที่แล้ว` : `${Math.floor(s / 60)} min ago`
  if (s < 86_400) return th ? `${Math.floor(s / 3600)} ชม. ที่แล้ว` : `${Math.floor(s / 3600)} h ago`
  const d = Math.floor(s / 86_400)
  if (d === 1) return th ? 'เมื่อวาน' : 'yesterday'
  return th ? `${d} วันที่แล้ว` : `${d} days ago`
}
