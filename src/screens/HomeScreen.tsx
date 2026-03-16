import { useRef, useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import BiometricHeader from '../components/BiometricHeader'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Period = 'Semana' | 'Mes'

const DAY_NAMES = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const DAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const PAST_COLORS = ['#F0A580', '#A4DDAB', '#FDE478', '#9CC4FF', '#F3D13F', '#A4DDAB', '#F0A580']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// Scroll strip: all days from 4 months ago to 4 months ahead
function buildScrollDays() {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth() - 4, 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 4, 0)
  const days: { day: string; date: number; month: number; color: string; textColor: string; isToday: boolean }[] = []
  const cur = new Date(start)
  while (cur <= end) {
    const isToday = cur.toDateString() === today.toDateString()
    const isPast = cur < today && !isToday
    const offset = Math.round((today.getTime() - cur.getTime()) / 86400000)
    days.push({
      day: DAY_NAMES[cur.getDay()],
      date: cur.getDate(),
      month: cur.getMonth(),
      color: isToday ? '#272724' : isPast ? PAST_COLORS[offset % PAST_COLORS.length] : '#F0F3FF',
      textColor: isToday ? '#FFFEFA' : isPast ? '#272724' : '#656359',
      isToday,
    })
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

// Full month grid for a given year/month
function buildMonthGrid(year: number, month: number) {
  const today = new Date()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // L=0 M=1 X=2 J=3 V=4 S=5 D=6 (JS: Sun=0 Mon=1...)
  // Convert JS getDay() to L-M-X-J-V-S-D index
  const jsToGrid = [6, 0, 1, 2, 3, 4, 5]
  const startCol = jsToGrid[firstDay.getDay()]

  const cells: { label: string; bg: string; text: string; faded?: boolean }[] = []

  // Leading empty cells (prev month)
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = startCol - 1; i >= 0; i--) {
    cells.push({ label: String(prevMonthDays - i), bg: '#F0F3FF', text: '#A0A0A0', faded: true })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const isToday = date.toDateString() === today.toDateString()
    const isPast = date < today && !isToday
    const offset = Math.round((today.getTime() - date.getTime()) / 86400000)
    const bg = isToday ? '#272724' : isPast ? PAST_COLORS[offset % PAST_COLORS.length] : '#F0F3FF'
    const text = isToday ? '#FFFEFA' : '#272724'
    cells.push({ label: String(d), bg, text })
  }

  // Trailing empty cells (next month)
  const remainder = cells.length % 7
  if (remainder !== 0) {
    for (let i = 1; i <= 7 - remainder; i++) {
      cells.push({ label: String(i), bg: '#F0F3FF', text: '#A0A0A0', faded: true })
    }
  }

  return cells
}

const scrollDays = buildScrollDays()
const todayIndex = scrollDays.findIndex(d => d.isToday)

// Events for today
const events = [
  { id: 1, time: '07:00', name: 'Gym', emojiIcon: '🔥', vfc: 'VFC Baja', vfcColor: '#F0A580', bg: '#FFCEB6', textColor: '#373D59', expanded: false },
  { id: 2, time: '09:00', name: 'Reunión team', emojiIcon: '⚡', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#FFF1B7', textColor: '#373D59', expanded: false },
  { id: 3, time: '09:00', name: 'Coffe time', emojiIcon: '😌', vfc: 'VFC Baja', vfcColor: '#373D59', bg: '#BCE5C1', textColor: '#373D59', expanded: false },
  { id: 4, time: '15:00', name: 'Inicio Sprint', emojiIcon: null, vfc: 'VFC Alta', vfcColor: '#272724', bg: '#EFEFEF', textColor: '#373D59', expanded: false },
  { id: 5, time: '19:00', name: 'Presentación', emojiIcon: '🔥', vfc: 'VFC Baja', vfcColor: '#373D59', bg: '#FFCEB6', textColor: '#373D59', expanded: true, insight: 'El sensor detectó un pico de tensión. Registraste que te has sentido nerviosa...' },
  { id: 6, time: '21:00', name: 'Cena con amigos', emojiIcon: null, vfc: null, bg: '#E0E6FF', textColor: '#373D59', opacity: 0.5, expanded: false },
]

const ITEM_WIDTH = 52 // 44px circle + 8px gap

export default function HomeScreen({ onNavigate }: Props) {
  const todayRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [period, setPeriod] = useState<Period>('Semana')
  const today = new Date()
  const [monthIndex, setMonthIndex] = useState(today.getMonth())
  const [monthYear, setMonthYear] = useState(today.getFullYear())
  const [stripMonth, setStripMonth] = useState(today.getMonth())

  // Scroll strip to today on mount
  useEffect(() => {
    if (stripRef.current) {
      const containerWidth = stripRef.current.clientWidth
      const scrollTo = todayIndex * ITEM_WIDTH - containerWidth / 2 + ITEM_WIDTH / 2
      stripRef.current.scrollLeft = Math.max(0, scrollTo)
    }
  }, [])

  function handleStripScroll(e: React.UIEvent<HTMLDivElement>) {
    const scrollLeft = e.currentTarget.scrollLeft
    const centerIndex = Math.round((scrollLeft + e.currentTarget.clientWidth / 2) / ITEM_WIDTH)
    const clampedIndex = Math.max(0, Math.min(scrollDays.length - 1, centerIndex))
    setStripMonth(scrollDays[clampedIndex]?.month ?? today.getMonth())
  }

  function scrollToToday() {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  function prevMonth() {
    if (monthIndex === 0) { setMonthIndex(11); setMonthYear(y => y - 1) }
    else setMonthIndex(i => i - 1)
  }

  function nextMonth() {
    if (monthIndex === 11) { setMonthIndex(0); setMonthYear(y => y + 1) }
    else setMonthIndex(i => i + 1)
  }

  const monthCells = buildMonthGrid(monthYear, monthIndex)
  const rows: typeof monthCells[] = []
  for (let i = 0; i < monthCells.length; i += 7) rows.push(monthCells.slice(i, i + 7))

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-14 px-5 pb-2">
        <p className="font-quicksand" style={{ fontSize: 18, color: '#272724', lineHeight: 1.35 }}>
          <span className="block">¡Hola Sofia! </span>
          <span className="block">¿Cómo te sientes hoy? </span>
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-hide">
        {/* Biometric Header Card */}
        <div className="pt-1 pb-2">
          <BiometricHeader status="activation" bpm={72} hrv={65} />
        </div>

        {/* Mood Calendar */}
        <div className="mb-4">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 mb-3">
            <span className="font-quicksand text-xl" style={{ color: '#272724' }}>Mood history</span>

            {/* Period toggle */}
            <button
              onClick={() => setPeriod(p => p === 'Semana' ? 'Mes' : 'Semana')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: '#9CADFF' }}
            >
              <span className="font-quicksand text-xs" style={{ color: '#272724' }}>{period}</span>
              <svg
                width="7" height="5" viewBox="0 0 7 5" fill="none"
                style={{ transition: 'transform 0.2s', transform: period === 'Mes' ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M1 1L3.5 4L6 1" stroke="#272724" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {period === 'Semana' ? (
            <>
              {/* Month label */}
              <div className="px-5 mb-1">
                <span className="font-quicksand text-xs" style={{ color: '#9B9789' }}>
                  {MONTHS[stripMonth]}
                </span>
              </div>
              {/* Scrollable day strip */}
              <div ref={stripRef} className="flex gap-2 px-4 overflow-x-auto scroll-hide pb-1" onScroll={handleStripScroll}>
                {scrollDays.map((d, i) => (
                  <div key={i} ref={d.isToday ? todayRef : undefined} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <span className="font-quicksand text-xs" style={{ color: d.isToday ? '#272724' : '#656359' }}>
                      {d.day}
                    </span>
                    <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: d.color }}>
                      <span className="font-quicksand font-medium text-sm" style={{ color: d.textColor }}>{d.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end px-5 mt-2">
                <span className="font-quicksand text-xs underline cursor-pointer" style={{ color: '#272724' }} onClick={scrollToToday}>
                  Volver a hoy
                </span>
              </div>
            </>
          ) : (
            <div className="px-4">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button onClick={prevMonth} className="font-quicksand text-xs font-medium opacity-40" style={{ color: '#272724' }}>
                  {'< '}{MONTHS[(monthIndex - 1 + 12) % 12]}
                </button>
                <span className="font-quicksand font-bold text-sm" style={{ color: '#272724' }}>{MONTHS[monthIndex]}</span>
                <button onClick={nextMonth} className="font-quicksand text-xs font-medium opacity-40" style={{ color: '#272724' }}>
                  {MONTHS[(monthIndex + 1) % 12]}{' >'}
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-x-1 mb-2">
                {DAY_HEADERS.map(h => (
                  <div key={h} className="flex items-center justify-center font-quicksand text-xs" style={{ color: '#272724', height: 20 }}>{h}</div>
                ))}
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-7 gap-x-1 gap-y-2 pb-2">
                {rows.flat().map((cell, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center rounded-full font-quicksand font-medium"
                    style={{
                      width: 36, height: 36,
                      background: cell.bg,
                      color: cell.faded ? '#A0A0A0' : cell.text,
                      fontSize: 13,
                      margin: '0 auto',
                    }}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-chewy" style={{ fontSize: 28, color: '#272724' }}>Eventos</h2>
            <button
              onClick={() => onNavigate('emotion-step1')}
              className="flex items-center justify-center rounded-full"
              style={{ width: 30, height: 30, background: '#272724' }}
            >
              <Plus size={18} color="#FFFEFA" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => event.expanded && onNavigate('emotion-step1')}
                className="w-full text-left card-press"
                style={{
                  background: event.bg,
                  borderRadius: 15,
                  padding: event.expanded ? '20px 15px 25px' : '16px 15px',
                  opacity: event.opacity || 1,
                  minHeight: 60,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="font-quicksand flex-shrink-0" style={{ fontSize: 12, color: event.textColor }}>{event.time}</span>
                    <span className="font-quicksand font-bold truncate" style={{ fontSize: 16, color: event.textColor }}>{event.name}</span>
                    {event.emojiIcon && <span style={{ fontSize: 16 }}>{event.emojiIcon}</span>}
                  </div>
                  {event.vfc && (
                    <div className="flex-shrink-0 px-2 py-1 rounded-xl" style={{ background: '#FFFEFA' }}>
                      <span className="font-quicksand font-medium" style={{ fontSize: 10, color: event.vfcColor }}>{event.vfc}</span>
                    </div>
                  )}
                </div>
                {event.expanded && event.insight && (
                  <div className="mt-3">
                    <p className="font-quicksand font-medium text-left" style={{ fontSize: 12, color: '#272724', lineHeight: 1.5 }}>{event.insight}</p>
                    <div className="mt-4 flex items-center justify-center rounded-xl" style={{ background: '#272724', padding: '11px 32px' }}>
                      <span className="font-quicksand font-bold" style={{ fontSize: 12, color: '#FFFEFA' }}>Más información</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav onNavigate={onNavigate} onAddPress={() => onNavigate('emotion-step1')} onCalendarPress={() => onNavigate('mood-history')} />
    </div>
  )
}
