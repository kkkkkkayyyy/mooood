import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Period = 'Semana' | 'Mes'

const YEAR = 2026
const NOW = new Date(YEAR, 3, 1) // April 1, 2026 (current date in app)
const THIS_MONTH = NOW.getMonth()
const THIS_DAY = NOW.getDate()

// Mood colors keyed by 'month-day' (month 0-indexed: 0=Jan, 1=Feb, 2=Mar, 3=Apr...)
const MOOD_COLORS: Record<string, { bg: string; text: string }> = {
  // February
  '1-23': { bg: '#A4DDAB', text: '#272724' },
  '1-24': { bg: '#F0A580', text: '#272724' },
  '1-25': { bg: '#FDE478', text: '#272724' },
  '1-26': { bg: '#9CC4FF', text: '#272724' },
  '1-27': { bg: '#F0A580', text: '#272724' },
  '1-28': { bg: '#A4DDAB', text: '#272724' },
  // March
  '2-1':  { bg: '#A4DDAB', text: '#272724' },
  '2-2':  { bg: '#9CC4FF', text: '#272724' },
  '2-3':  { bg: '#9CC4FF', text: '#272724' },
  '2-4':  { bg: '#F0A580', text: '#272724' },
  '2-5':  { bg: '#A4DDAB', text: '#272724' },
  '2-6':  { bg: '#FDE478', text: '#272724' },
  '2-7':  { bg: '#FDE478', text: '#272724' },
  '2-8':  { bg: '#A4DDAB', text: '#272724' },
  '2-9':  { bg: '#A4DDAB', text: '#272724' },
  '2-10': { bg: '#272724', text: '#FFFEFA' },
  '2-11': { bg: '#F0A580', text: '#272724' },
  '2-12': { bg: '#A4DDAB', text: '#272724' },
  '2-13': { bg: '#FDE478', text: '#272724' },
  '2-14': { bg: '#9CC4FF', text: '#272724' },
  '2-15': { bg: '#A4DDAB', text: '#272724' },
  '2-16': { bg: '#F0A580', text: '#272724' },
  '2-17': { bg: '#FDE478', text: '#272724' },
  '2-18': { bg: '#9CC4FF', text: '#272724' },
  '2-19': { bg: '#A4DDAB', text: '#272724' },
  '2-20': { bg: '#F0A580', text: '#272724' },
  '2-21': { bg: '#A4DDAB', text: '#272724' },
  '2-22': { bg: '#9CC4FF', text: '#272724' },
  '2-23': { bg: '#FDE478', text: '#272724' },
  '2-24': { bg: '#A4DDAB', text: '#272724' },
  '2-25': { bg: '#F0A580', text: '#272724' },
  '2-26': { bg: '#9CC4FF', text: '#272724' },
  '2-27': { bg: '#A4DDAB', text: '#272724' },
  '2-28': { bg: '#FDE478', text: '#272724' },
  '2-29': { bg: '#9CC4FF', text: '#272724' },
  '2-30': { bg: '#F0A580', text: '#272724' },
  '2-31': { bg: '#A4DDAB', text: '#272724' },
}

const FUTURE_CELL = { bg: '#E0E6FF', text: '#272724' }
const TODAY_CELL  = { bg: '#272724', text: '#FFFEFA' }

const DAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

type CalendarCell = {
  day: number
  month: number // 0-indexed absolute month in YEAR
  monthOffset: number // -1=prev, 0=current, 1=next
}

function buildMonthCells(monthIndex: number): CalendarCell[] {
  const firstDay = new Date(YEAR, monthIndex, 1)
  const daysInMonth = new Date(YEAR, monthIndex + 1, 0).getDate()
  const prevMonthDays = new Date(YEAR, monthIndex, 0).getDate()
  // Mon-first: Sun=6, Mon=0, Tue=1...
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7

  const cells: CalendarCell[] = []

  // Leading: prev month overflow
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, month: monthIndex - 1, monthOffset: -1 })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: monthIndex, monthOffset: 0 })
  }

  // Trailing: next month overflow
  const remainder = cells.length % 7
  if (remainder !== 0) {
    for (let d = 1; d <= 7 - remainder; d++) {
      cells.push({ day: d, month: monthIndex + 1, monthOffset: 1 })
    }
  }

  return cells
}

function getCellInfo(cell: CalendarCell): {
  bg: string; text: string; opacity: number; isToday: boolean; isFuture: boolean
} {
  const isToday = cell.month === THIS_MONTH && cell.day === THIS_DAY
  const isPast = cell.month < THIS_MONTH || (cell.month === THIS_MONTH && cell.day < THIS_DAY)
  const isFuture = !isToday && !isPast

  if (isToday && cell.monthOffset === 0) return { ...TODAY_CELL, opacity: 1, isToday: true, isFuture: false }

  const key = `${cell.month}-${cell.day}`
  const mood = MOOD_COLORS[key]

  if (isFuture) return { ...FUTURE_CELL, opacity: cell.monthOffset !== 0 ? 0.45 : 1, isToday: false, isFuture: true }
  if (mood) return { ...mood, opacity: cell.monthOffset !== 0 ? 0.45 : 1, isToday: false, isFuture: false }

  // Past but no mood recorded
  return { bg: '#EFEFEF', text: '#272724', opacity: cell.monthOffset !== 0 ? 0.35 : 0.6, isToday: false, isFuture: false }
}

// Events from Figma
const EVENTS = [
  { date: '01 de marzo 2026', time: '07:00', name: 'Gym',          vfc: 'VFC Baja', bg: '#FFCEB6', icon: '🌿' },
  { date: '02 de marzo 2026', time: '18:00', name: 'Quedada',      vfc: 'VFC Baja', bg: '#BCE5C1', icon: '😌' },
  { date: '03 de marzo 2026', time: '09:00', name: 'Coffe time',   vfc: 'VFC Alta', bg: '#FFF1B7', icon: '⚡' },
  { date: '04 de marzo 2026', time: '17:00', name: 'Gym',          vfc: 'VFC Baja', bg: '#FFCEB6', icon: '🌿' },
  { date: '05 de marzo 2026', time: '17:00', name: 'Presentación', vfc: 'VFC Baja', bg: '#DAE9FF', icon: '💧' },
]

export default function MoodHistoryScreen({ onNavigate }: Props) {
  const [period, setPeriod] = useState<Period>('Mes')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [monthIndex, setMonthIndex] = useState(THIS_MONTH)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const monthCells = buildMonthCells(monthIndex)

  // Week view: row containing today (or first row if today not in current month)
  const weekCells = (() => {
    const todayIdx = monthCells.findIndex(c => c.month === THIS_MONTH && c.day === THIS_DAY)
    const start = todayIdx >= 0 ? Math.floor(todayIdx / 7) * 7 : 0
    return monthCells.slice(start, start + 7)
  })()

  const displayCells = period === 'Mes' ? monthCells : weekCells

  const rows: CalendarCell[][] = []
  for (let i = 0; i < displayCells.length; i += 7) {
    rows.push(displayCells.slice(i, i + 7))
  }

  const prevMonthName = MONTHS[(monthIndex - 1 + 12) % 12]
  const nextMonthName = MONTHS[(monthIndex + 1) % 12]

  return (
    <div
      className="flex flex-col h-full overflow-y-auto scroll-hide"
      style={{ background: '#FFFEFA', fontFamily: 'Quicksand, sans-serif' }}
    >
      <div className="px-5 pt-12 pb-5">
        <p className="text-[18px] leading-[1.3] text-[#272724]">
          ¡Hola Sofia! <br />
          ¿Cómo te sientes hoy?
        </p>
      </div>

      <div className="flex-1 px-5">

        {/* Title row + period button */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[20px] font-normal text-[#272724]">Mood history</p>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] text-[#272724] transition-all active:scale-95"
              style={{ background: '#E0E6FF', height: 45, minWidth: 98 }}
            >
              <span className="flex-1 text-center">{period}</span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className="flex-shrink-0 transition-transform duration-300"
                style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            <div
              className="absolute right-0 mt-1 rounded-2xl overflow-hidden shadow-lg z-50 transition-all duration-200"
              style={{
                background: '#FFFEFA',
                border: '1px solid #E0E6FF',
                minWidth: 120,
                opacity: dropdownOpen ? 1 : 0,
                transform: dropdownOpen ? 'translateY(0)' : 'translateY(-8px)',
                pointerEvents: dropdownOpen ? 'auto' : 'none',
              }}
            >
              {(['Semana', 'Mes'] as Period[]).map(opt => (
                <button
                  key={opt}
                  onClick={() => { setPeriod(opt); setDropdownOpen(false) }}
                  className="w-full px-5 py-3 text-left text-[13px] text-[#272724] transition-colors hover:bg-[#F0F3FF] active:scale-95"
                  style={{
                    background: period === opt ? '#C2CDFF' : 'transparent',
                    fontWeight: period === opt ? 600 : 400,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            onClick={() => setMonthIndex(i => (i - 1 + 12) % 12)}
            className="text-[12px] font-medium text-[#272724] opacity-25 hover:opacity-60 transition-opacity"
          >
            {'< '}{prevMonthName}
          </button>
          <p className="text-[16px] font-bold text-[#272724] text-center w-[107px]">
            {MONTHS[monthIndex]}
          </p>
          <button
            onClick={() => setMonthIndex(i => (i + 1) % 12)}
            className="text-[12px] font-medium text-[#272724] opacity-25 hover:opacity-60 transition-opacity"
          >
            {nextMonthName}{' >'}
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-x-[14px] px-4 mb-2">
          {DAY_HEADERS.map(h => (
            <div
              key={h}
              className="flex items-center justify-center text-[12px] text-[#272724]"
              style={{ width: 40, height: 20 }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          key={`${period}-${monthIndex}`}
          className="grid grid-cols-7 gap-x-[14px] gap-y-[12px] px-4 py-2 mb-4 animate-fade-in"
        >
          {rows.flat().map((cell, idx) => {
            const { bg, text, opacity } = getCellInfo(cell)
            return (
              <div
                key={idx}
                className="flex items-center justify-center rounded-full text-[15px] font-medium cursor-pointer transition-transform active:scale-90"
                style={{ width: 40, height: 40, background: bg, color: text, opacity, flexShrink: 0 }}
              >
                {cell.day}
              </div>
            )
          })}
        </div>

        {/* Events list */}
        <div className="flex flex-col gap-3 pb-8">
          {EVENTS.map((ev, i) => (
            <div key={i}>
              <p className="text-[14px] font-bold text-[#272724] mb-2">{ev.date}</p>
              <button
                className="w-full flex items-center justify-between px-4 py-5 rounded-[15px] text-left active:scale-[0.98] transition-transform"
                style={{ background: ev.bg, maxWidth: 350, minHeight: 60 }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[12px] text-[#373D59]">{ev.time}</span>
                  <span className="text-[16px] font-bold text-[#373D59]">{ev.name}</span>
                  <span className="text-[16px]">{ev.icon}</span>
                </div>
                <div
                  className="flex items-center justify-center px-1.5 py-1 rounded-xl text-[10px] font-medium text-[#373D59]"
                  style={{ background: '#FFFEFA' }}
                >
                  {ev.vfc}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav
        onNavigate={onNavigate}
        onAddPress={() => onNavigate('emotion-step1')}
        onCalendarPress={() => onNavigate('mood-history')}
        calendarActive
      />
    </div>
  )
}
