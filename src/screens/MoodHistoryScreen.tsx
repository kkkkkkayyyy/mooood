import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Period = 'Semana' | 'Mes'

// March 2026 starts on Sunday (col 7 in L-M-X-J-V-S-D grid)
// Day 1 = Sunday = col 7, so offset = 6 empty cells before day 1
// Mood colors for days 1–9 (from Figma); 10 = today; 11+ = future (primary-300)
const MOOD_COLORS: Record<number, { bg: string; text: string }> = {
  // Feb overflow days (shown as future)
  23: { bg: '#A4DDAB', text: '#272724' }, // calma-300
  24: { bg: '#F0A580', text: '#272724' }, // tension-300
  25: { bg: '#FDE478', text: '#272724' }, // impulso-300
  26: { bg: '#9CC4FF', text: '#272724' }, // tristeza-200
  27: { bg: '#F0A580', text: '#272724' }, // tension-300
  28: { bg: '#A4DDAB', text: '#272724' }, // calma-300
  // March
  1:  { bg: '#A4DDAB', text: '#272724' }, // calma-300
  2:  { bg: '#9CC4FF', text: '#272724' }, // tristeza-200
  3:  { bg: '#9CC4FF', text: '#272724' }, // tristeza-200
  4:  { bg: '#F0A580', text: '#272724' }, // tension-300
  5:  { bg: '#A4DDAB', text: '#272724' }, // calma-300
  6:  { bg: '#FDE478', text: '#272724' }, // impulso-300
  7:  { bg: '#FDE478', text: '#272724' }, // impulso-300
  8:  { bg: '#A4DDAB', text: '#272724' }, // calma-300
  9:  { bg: '#A4DDAB', text: '#272724' }, // calma-300
  10: { bg: '#272724', text: '#FFFEFA' }, // today — dark
}

const FUTURE_CELL = { bg: '#E0E6FF', text: '#272724' }
const TODAY = 10

const DAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

// March 2026: starts on Sunday (index 6 in 0-based L-M-X-J-V-S-D), 31 days
// offset = 6 (6 empty cells at start of grid for the first row)
const MARCH_OFFSET = 6
const MARCH_DAYS = 31

// Build the full calendar cells array (offset nulls + days 1–31 + trailing nulls for complete rows)
function buildMonthCells() {
  const cells: (number | null)[] = []
  // leading empty cells (Feb overflow: 23–28)
  const febOverflow = [23, 24, 25, 26, 27, 28]
  for (let i = 0; i < MARCH_OFFSET; i++) {
    cells.push(-(febOverflow[i])) // negative = Feb day, handled specially
  }
  for (let d = 1; d <= MARCH_DAYS; d++) {
    cells.push(d)
  }
  // trailing (April overflow: 1–5) to fill last row
  const totalCells = cells.length
  const remainder = totalCells % 7
  if (remainder !== 0) {
    const trailing = 7 - remainder
    for (let i = 1; i <= trailing; i++) cells.push(-(100 + i)) // negative 100s = April
  }
  return cells
}

// Current week containing day 10: the row where 10 falls
// offset 6 means day 1 is at index 6 → day 10 is at index 15 → row 3 (0-indexed row 2)
function buildWeekCells() {
  const allCells = buildMonthCells()
  const idx = allCells.findIndex(c => c === TODAY)
  const rowStart = Math.floor(idx / 7) * 7
  return allCells.slice(rowStart, rowStart + 7)
}

function getCellStyle(cell: number | null): { bg: string; text: string } {
  if (cell === null) return FUTURE_CELL
  if (cell < 0) {
    // Feb overflow (negative single digits) or April overflow (negative 100s)
    const absDay = Math.abs(cell)
    if (absDay >= 100) return FUTURE_CELL // April
    // Feb
    const mood = MOOD_COLORS[absDay]
    return mood || FUTURE_CELL
  }
  if (cell === TODAY) return MOOD_COLORS[TODAY]
  if (cell < TODAY) return MOOD_COLORS[cell] || FUTURE_CELL
  return FUTURE_CELL
}

function getCellLabel(cell: number | null): string {
  if (cell === null) return ''
  if (cell < 0) {
    const absDay = Math.abs(cell)
    if (absDay >= 100) return String(absDay - 100) // April: 101→1, 102→2...
    return String(absDay) // Feb day
  }
  return String(cell)
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

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
  const [monthIndex, setMonthIndex] = useState(2) // March = index 2
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const monthCells = buildMonthCells()
  const weekCells = buildWeekCells()
  const displayCells = period === 'Mes' ? monthCells : weekCells

  // Split month cells into rows of 7
  const rows: (number | null)[][] = []
  for (let i = 0; i < displayCells.length; i += 7) {
    rows.push(displayCells.slice(i, i + 7))
  }

  const prevMonth = MONTHS[(monthIndex - 1 + 12) % 12]
  const nextMonth = MONTHS[(monthIndex + 1) % 12]
  const currentMonthName = MONTHS[monthIndex]

  function selectPeriod(p: Period) {
    setPeriod(p)
    setDropdownOpen(false)
  }

  return (
    <div
      className="flex flex-col h-full overflow-y-auto scroll-hide"
      style={{ background: '#FFFEFA', fontFamily: 'Quicksand, sans-serif' }}
    >
      {/* Header greeting */}
      <div className="px-5 pt-12 pb-5">
        <p className="text-[18px] leading-[1.3] text-[#272724]">
          ¡Hola Sofia! <br />
          ¿Cómo te sientes hoy?
        </p>
      </div>

      {/* Mood history section */}
      <div className="flex-1 px-5">

        {/* Title row + period button */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-[20px] font-normal text-[#272724]">Mood history</p>

          {/* Dropdown wrapper */}
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

            {/* Animated dropdown panel */}
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
                  onClick={() => selectPeriod(opt)}
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
            {'< '}{prevMonth}
          </button>
          <p className="text-[16px] font-bold text-[#272724] text-center w-[107px]">
            {currentMonthName}
          </p>
          <button
            onClick={() => setMonthIndex(i => (i + 1) % 12)}
            className="text-[12px] font-medium text-[#272724] opacity-25 hover:opacity-60 transition-opacity"
          >
            {nextMonth}{' >'}
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

        {/* Calendar grid — animates when period changes */}
        <div
          key={period}
          className="grid grid-cols-7 gap-x-[14px] gap-y-[12px] px-4 py-2 mb-4 animate-fade-in"
        >
          {rows.flat().map((cell, idx) => {
            const { bg, text } = getCellStyle(cell)
            const label = getCellLabel(cell)
            return (
              <div
                key={idx}
                className="flex items-center justify-center rounded-full text-[15px] font-medium cursor-pointer transition-transform active:scale-90"
                style={{ width: 40, height: 40, background: bg, color: text, flexShrink: 0 }}
              >
                {label}
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

      {/* Bottom Nav — calendar icon active */}
      <BottomNav
        onNavigate={onNavigate}
        onAddPress={() => onNavigate('emotion-step1')}
        onCalendarPress={() => onNavigate('mood-history')}
        calendarActive
      />
    </div>
  )
}
