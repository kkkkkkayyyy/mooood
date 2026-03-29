import { useRef, useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import BiometricHeader from '../components/BiometricHeader'
import { Screen } from '../App'
import { EventDetail } from './EventDetailScreen'

interface Props {
  onNavigate: (screen: Screen) => void
  userName?: string
  wearableConnected?: boolean
  onEventDetail?: (event: EventDetail) => void
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

type EventItem = { id: number; time: string; name: string; emojiIcon: string | null; vfc: string | null; vfcColor?: string; bg: string; textColor: string; locked: boolean; insight: string }

const EVENTS_BY_OFFSET: Record<number, EventItem[]> = {
  0: [ // hoy
    { id: 1, time: '07:00', name: 'Gym', emojiIcon: '🔥', vfc: 'VFC Baja', vfcColor: '#F0A580', bg: '#FFCEB6', textColor: '#373D59', locked: false, insight: 'El sensor detectó una frecuencia cardíaca elevada durante el entreno. ¡Buen trabajo!' },
    { id: 2, time: '09:00', name: 'Reunión team', emojiIcon: '⚡', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#FFF1B7', textColor: '#373D59', locked: false, insight: 'Tu VFC alta indica que afrontaste la reunión con calma y concentración.' },
    { id: 3, time: '09:00', name: 'Coffe time', emojiIcon: '😌', vfc: 'VFC Baja', vfcColor: '#373D59', bg: '#BCE5C1', textColor: '#373D59', locked: false, insight: 'Momento de desconexión detectado. Tu ritmo cardíaco bajó notablemente.' },
    { id: 4, time: '15:00', name: 'Inicio Sprint', emojiIcon: null, vfc: 'VFC Alta', vfcColor: '#272724', bg: '#EFEFEF', textColor: '#373D59', locked: false, insight: 'Entrada al sprint con buena activación. El sensor registró foco sostenido.' },
    { id: 5, time: '19:00', name: 'Presentación', emojiIcon: '🔥', vfc: 'VFC Baja', vfcColor: '#373D59', bg: '#FFCEB6', textColor: '#373D59', locked: false, insight: 'El sensor detectó un pico de tensión. Registraste que te has sentido nerviosa...' },
    { id: 6, time: '21:00', name: 'Cena con amigos', emojiIcon: null, vfc: null, bg: '#E0E6FF', textColor: '#373D59', locked: true, insight: '' },
  ],
  1: [ // ayer
    { id: 1, time: '08:00', name: 'Meditación', emojiIcon: '🧘', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#BCE5C1', textColor: '#373D59', locked: false, insight: 'Tu VFC se disparó positivamente. La meditación matutina te dejó muy equilibrada.' },
    { id: 2, time: '11:00', name: 'Café con Laura', emojiIcon: '☕', vfc: 'VFC Baja', vfcColor: '#F0A580', bg: '#FFF1B7', textColor: '#373D59', locked: false, insight: 'Ritmo cardíaco tranquilo. Una conversación agradable y relajante.' },
    { id: 3, time: '14:00', name: 'Revisión proyecto', emojiIcon: '💻', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#EFEFEF', textColor: '#373D59', locked: false, insight: 'Foco elevado detectado durante 2 horas. Gran sesión de trabajo profundo.' },
    { id: 4, time: '20:00', name: 'Yoga', emojiIcon: '🌿', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#E0E6FF', textColor: '#373D59', locked: false, insight: 'Final del día con activación positiva. El yoga ayudó a cerrar bien la jornada.' },
  ],
  2: [
    { id: 1, time: '09:00', name: 'Stand-up', emojiIcon: '⚡', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#FFF1B7', textColor: '#373D59', locked: false, insight: 'Reunión breve con buena energía. Sin picos de estrés detectados.' },
    { id: 2, time: '12:00', name: 'Comida equipo', emojiIcon: '🍽️', vfc: 'VFC Baja', vfcColor: '#F0A580', bg: '#FFCEB6', textColor: '#373D59', locked: false, insight: 'Momento social relajado. Tu cuerpo respondió bien al descanso.' },
    { id: 3, time: '16:00', name: 'Llamada cliente', emojiIcon: '📞', vfc: 'VFC Baja', vfcColor: '#373D59', bg: '#E0E6FF', textColor: '#373D59', locked: false, insight: 'Se detectó leve tensión al inicio. Se estabilizó en los primeros 5 minutos.' },
  ],
  3: [
    { id: 1, time: '07:30', name: 'Running', emojiIcon: '🏃', vfc: 'VFC Baja', vfcColor: '#F0A580', bg: '#FFCEB6', textColor: '#373D59', locked: false, insight: 'Alta activación física. BPM máximo: 162. Recuperación en 8 minutos.' },
    { id: 2, time: '10:00', name: 'Taller diseño', emojiIcon: '🎨', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#BCE5C1', textColor: '#373D59', locked: false, insight: 'Flujo creativo detectado. Tu VFC fue alta y estable durante toda la sesión.' },
    { id: 3, time: '13:00', name: 'Pausa activa', emojiIcon: '🌤️', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#FFF1B7', textColor: '#373D59', locked: false, insight: 'Pequeño paseo que recargó tu energía para la tarde.' },
    { id: 4, time: '17:00', name: 'Revisión OKRs', emojiIcon: null, vfc: 'VFC Baja', vfcColor: '#F0A580', bg: '#EFEFEF', textColor: '#373D59', locked: false, insight: 'Algo de presión detectada al revisar los objetivos. Normal en este contexto.' },
    { id: 5, time: '21:00', name: 'Serie en casa', emojiIcon: '📺', vfc: 'VFC Alta', vfcColor: '#272724', bg: '#E0E6FF', textColor: '#373D59', locked: false, insight: 'Noche tranquila. Tu cuerpo entró en modo de recuperación a las 22:00.' },
  ],
}

// Para días más antiguos, rotamos entre los sets disponibles
function getEventsForOffset(offset: number): EventItem[] {
  if (offset === 0) return EVENTS_BY_OFFSET[0]
  const key = ((offset - 1) % 3) + 1
  return EVENTS_BY_OFFSET[key] ?? EVENTS_BY_OFFSET[1]
}

// Eventos para días futuros (desactivados, varían por día)
const FUTURE_EVENTS_SETS: EventItem[][] = [
  [ // set 0 — sin eventos
  ],
  [ // set 1
    { id: 1, time: '09:00', name: 'Reunión semanal', emojiIcon: '📅', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 2, time: '14:00', name: 'Bloque de trabajo', emojiIcon: null, vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 3, time: '19:00', name: 'Entreno', emojiIcon: '💪', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
  ],
  [ // set 2 — día libre
  ],
  [ // set 3
    { id: 1, time: '10:00', name: 'Call con cliente', emojiIcon: '📞', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 2, time: '13:00', name: 'Comida', emojiIcon: '🍽️', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
  ],
  [ // set 4
    { id: 1, time: '08:00', name: 'Gym', emojiIcon: '🏋️', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 2, time: '11:00', name: 'Workshop', emojiIcon: '🎯', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 3, time: '16:00', name: 'Revisión sprint', emojiIcon: null, vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 4, time: '20:00', name: 'Cena con amigos', emojiIcon: '🍕', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
  ],
  [ // set 5 — sin eventos
  ],
  [ // set 6
    { id: 1, time: '09:30', name: 'Dentista', emojiIcon: '🦷', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
    { id: 2, time: '15:00', name: 'Pilates', emojiIcon: '🧘', vfc: null, bg: '#EFEFEF', textColor: '#373D59', locked: true, insight: '' },
  ],
]

function getFutureEvents(offset: number): EventItem[] {
  return FUTURE_EVENTS_SETS[Math.abs(offset) % FUTURE_EVENTS_SETS.length]
}

const ITEM_WIDTH = 52 // 44px circle + 8px gap

type Category = 'Trabajo' | 'Social' | 'Salud' | 'Otro'
const CATEGORY_COLORS: Record<Category, { bg: string }> = {
  Trabajo: { bg: '#FFF1B7' },
  Social:  { bg: '#BCE5C1' },
  Salud:   { bg: '#FFCEB6' },
  Otro:    { bg: '#E0E6FF' },
}
const CATEGORY_EMOJI: Record<Category, string | null> = {
  Trabajo: '💼', Social: '👥', Salud: '💪', Otro: null,
}

const DAY_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

export default function HomeScreen({ onNavigate, userName, wearableConnected = false, onEventDetail }: Props) {
  const todayRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [period, setPeriod] = useState<Period>('Semana')
  const today = new Date()
  const [monthIndex, setMonthIndex] = useState(today.getMonth())
  const [monthYear, setMonthYear] = useState(today.getFullYear())
  const [stripMonth, setStripMonth] = useState(today.getMonth())
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex)
  const [customEvents, setCustomEvents] = useState<Record<number, EventItem[]>>({})

  // Add event modal state
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<Category>('Trabajo')
  const [newStartDate, setNewStartDate] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [newStartTime, setNewStartTime] = useState('09:00')
  const [newEndTime, setNewEndTime] = useState('10:00')
  const [helpOption, setHelpOption] = useState<'regulacion' | 'no' | null>(null)

  const selectedDay = scrollDays[selectedDayIndex]
  const selectedIsToday = selectedDay?.isToday ?? true
  const selectedIsPast = !selectedIsToday && selectedDayIndex < todayIndex
  const selectedIsFuture = !selectedIsToday && selectedDayIndex > todayIndex
  const dayOffset = todayIndex - selectedDayIndex // positive = past
  const futureOffset = selectedDayIndex - todayIndex
  const baseEvents = selectedIsFuture ? getFutureEvents(futureOffset) : getEventsForOffset(dayOffset)
  const activeEvents = [...baseEvents, ...(customEvents[selectedDayIndex] ?? [])]
    .sort((a, b) => a.time.localeCompare(b.time))

  // Date label for modal
  const modalDate = new Date(today)
  modalDate.setDate(today.getDate() + (selectedDayIndex - todayIndex))
  const modalDateLabel = `${DAY_FULL[modalDate.getDay()]}, ${modalDate.getDate()} ${MONTH_SHORT[modalDate.getMonth()]}`

  function openAddModal() {
    setNewTitle('')
    setNewCategory('Trabajo')
    const iso = modalDate.toISOString().split('T')[0]
    setNewStartDate(iso)
    setNewEndDate(iso)
    setNewStartTime('09:00')
    setNewEndTime('10:00')
    setHelpOption(null)
    setShowAddModal(true)
  }

  function saveNewEvent() {
    if (!newTitle.trim()) return

    // Calculate the correct scrollDays index from the chosen date
    const targetDate = new Date(newStartDate + 'T12:00:00')
    const todayNoon = new Date()
    todayNoon.setHours(12, 0, 0, 0)
    const diffDays = Math.round((targetDate.getTime() - todayNoon.getTime()) / 86400000)
    const targetIndex = Math.max(0, Math.min(scrollDays.length - 1, todayIndex + diffDays))

    const isFuture = targetIndex > todayIndex
    const ev: EventItem = {
      id: Date.now(),
      time: newStartTime,
      name: newTitle.trim(),
      emojiIcon: isFuture ? null : CATEGORY_EMOJI[newCategory],
      vfc: null,
      bg: isFuture ? '#EFEFEF' : CATEGORY_COLORS[newCategory].bg,
      textColor: '#373D59',
      locked: isFuture,
      insight: '',
    }
    setCustomEvents(prev => ({
      ...prev,
      [targetIndex]: [...(prev[targetIndex] ?? []), ev],
    }))
    // Navigate calendar to the saved day
    setSelectedDayIndex(targetIndex)
    setExpandedIds(new Set())
    setShowAddModal(false)
  }

  function toggleEvent(id: number) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleDayClick(index: number) {
    setSelectedDayIndex(index)
    setExpandedIds(new Set())
  }

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
    setSelectedDayIndex(todayIndex)
    setExpandedIds(new Set())
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
          <span className="block">¡Hola {userName || 'Sofia'}! </span>
          <span className="block">¿Cómo te sientes hoy? </span>
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-hide">
        {/* Biometric Header Card */}
        <div className="pt-1 pb-2">
          {wearableConnected ? (
            <BiometricHeader status="activation" bpm={72} hrv={65} />
          ) : (
            <div
              className="mx-4 mb-3 rounded-2xl px-4 py-4 flex items-center gap-3 cursor-pointer"
              style={{ background: '#F0F0F0', border: '1.5px dashed #C0C0C0' }}
              onClick={() => onNavigate('profile')}
            >
              <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 36, height: 36, background: '#E0E0E0' }}>
                <span style={{ fontSize: 18 }}>⌚</span>
              </div>
              <div className="flex-1">
                <p className="font-quicksand font-semibold" style={{ fontSize: 13, color: '#272724' }}>Datos no disponibles</p>
                <p className="font-quicksand" style={{ fontSize: 11, color: '#9B9789' }}>Conecta tu wearable para ver tus métricas en tiempo real</p>
              </div>
              <span className="font-quicksand font-semibold" style={{ fontSize: 11, color: '#9CADFF' }}>Conectar →</span>
            </div>
          )}
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
                {scrollDays.map((d, i) => {
                  const isSelected = i === selectedDayIndex
                  return (
                    <div
                      key={i}
                      ref={d.isToday ? todayRef : undefined}
                      className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
                      onClick={() => handleDayClick(i)}
                    >
                      <span className="font-quicksand text-xs" style={{ color: d.isToday ? '#272724' : '#656359' }}>
                        {d.day}
                      </span>
                      <div
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: 44, height: 44,
                          background: d.color,
                          outline: isSelected && !d.isToday ? '2.5px solid #272724' : 'none',
                          outlineOffset: 2,
                        }}
                      >
                        <span className="font-quicksand font-medium text-sm" style={{ color: d.textColor }}>{d.date}</span>
                      </div>
                    </div>
                  )
                })}
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
            <div>
              <h2 className="font-chewy" style={{ fontSize: 28, color: '#272724' }}>Eventos</h2>
              {!selectedIsToday && (
                <span className="font-quicksand text-xs" style={{ color: '#9B9789' }}>
                  {selectedIsPast ? `${selectedDay?.date} ${MONTHS[selectedDay?.month ?? 0]}` : `${selectedDay?.date} ${MONTHS[selectedDay?.month ?? 0]} · próximamente`}
                </span>
              )}
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center rounded-full"
              style={{ width: 30, height: 30, background: '#272724' }}
            >
              <Plus size={18} color="#FFFEFA" strokeWidth={2.5} />
            </button>
          </div>

          {activeEvents.length === 0 && (
            <div className="flex flex-col items-center py-10">
              <span style={{ fontSize: 36 }}>✨</span>
              <p className="font-quicksand mt-2" style={{ fontSize: 14, color: '#9B9789' }}>
                {selectedIsFuture ? 'Sin eventos planificados' : 'Sin eventos registrados'}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {activeEvents.map((event) => {
              const isExpanded = expandedIds.has(event.id)
              const isFutureDay = selectedIsFuture
              const isLocked = event.locked || isFutureDay
              return (
                <button
                  key={event.id}
                  onClick={() => !isLocked && toggleEvent(event.id)}
                  className="w-full text-left card-press"
                  style={{
                    background: event.bg,
                    borderRadius: 15,
                    padding: isExpanded ? '20px 15px 25px' : '16px 15px',
                    opacity: isLocked ? 0.45 : 1,
                    minHeight: 60,
                    cursor: isLocked ? 'default' : 'pointer',
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
                  {isExpanded && event.insight && !isFutureDay && (
                    <div className="mt-3">
                      <p className="font-quicksand font-medium text-left" style={{ fontSize: 12, color: '#272724', lineHeight: 1.5 }}>{event.insight}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventDetail?.(event)
                        }}
                        className="mt-4 w-full flex items-center justify-center rounded-xl"
                        style={{ background: '#272724', padding: '11px 32px' }}
                      >
                        <span className="font-quicksand font-bold" style={{ fontSize: 12, color: '#FFFEFA' }}>Más información</span>
                      </button>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav onNavigate={onNavigate} onAddPress={() => onNavigate('emotion-step1')} onCalendarPress={() => onNavigate('home')} calendarActive={true} />

      {/* Add Event Modal */}
      {showAddModal && (
        <div
          className="absolute inset-0 flex flex-col"
          style={{ background: '#ECEEFF', zIndex: 50 }}
        >
          {/* Modal header */}
          <div className="flex-shrink-0 pt-14 px-5 pb-4 flex items-center justify-between">
            <span className="font-quicksand font-semibold" style={{ fontSize: 18, color: '#656359' }}>Evento</span>
            <button onClick={() => setShowAddModal(false)}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 5L17 17M17 5L5 17" stroke="#9B9789" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto scroll-hide px-5 pb-6">

            {/* Title input */}
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Añadir un título"
              className="w-full font-quicksand outline-none px-4 py-4 rounded-2xl mb-5"
              style={{ background: '#DDE1FF', fontSize: 15, color: '#272724' }}
            />

            {/* Categories */}
            <div className="flex gap-2 flex-wrap mb-6">
              {(['Trabajo', 'Social', 'Salud', 'Otro'] as Category[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className="font-quicksand font-medium px-4 py-2 rounded-full"
                  style={{
                    background: newCategory === cat ? '#272724' : 'transparent',
                    border: newCategory === cat ? 'none' : '1.5px solid #272724',
                    color: newCategory === cat ? '#FFFEFA' : '#272724',
                    fontSize: 14,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* When */}
            <p className="font-quicksand font-semibold mb-3" style={{ fontSize: 15, color: '#272724' }}>¿Cándo?</p>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="date"
                value={newStartDate}
                onChange={e => setNewStartDate(e.target.value)}
                className="flex-1 font-quicksand outline-none rounded-xl"
                style={{ background: '#DDE1FF', padding: '8px 12px', fontSize: 13, color: '#272724', border: 'none' }}
              />
              <input
                type="time"
                value={newStartTime}
                onChange={e => setNewStartTime(e.target.value)}
                className="font-quicksand font-medium text-center outline-none rounded-xl"
                style={{ background: '#DDE1FF', padding: '8px 12px', fontSize: 13, color: '#272724', border: 'none' }}
              />
            </div>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="date"
                value={newEndDate}
                onChange={e => setNewEndDate(e.target.value)}
                className="flex-1 font-quicksand outline-none rounded-xl"
                style={{ background: '#DDE1FF', padding: '8px 12px', fontSize: 13, color: '#272724', border: 'none' }}
              />
              <input
                type="time"
                value={newEndTime}
                onChange={e => setNewEndTime(e.target.value)}
                className="font-quicksand font-medium text-center outline-none rounded-xl"
                style={{ background: '#DDE1FF', padding: '8px 12px', fontSize: 13, color: '#272724', border: 'none' }}
              />
            </div>

            {/* Help */}
            <p className="font-quicksand font-semibold mb-3" style={{ fontSize: 14, color: '#272724' }}>¿Quieres que te ayudemos con algo?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setHelpOption(o => o === 'regulacion' ? null : 'regulacion')}
                className="flex-1 font-quicksand font-medium px-3 py-2.5 rounded-xl text-center"
                style={{
                  background: helpOption === 'regulacion' ? '#9CADFF' : '#D8DCFF',
                  fontSize: 12,
                  color: '#272724',
                }}
              >
                Regulación emocional
              </button>
              <button
                onClick={() => setHelpOption(o => o === 'no' ? null : 'no')}
                className="flex-1 font-quicksand font-medium px-3 py-2.5 rounded-xl text-center"
                style={{
                  background: helpOption === 'no' ? '#9CADFF' : '#D8DCFF',
                  fontSize: 12,
                  color: '#272724',
                }}
              >
                No gracias
              </button>
            </div>
          </div>

          {/* Save button */}
          <div className="flex-shrink-0 px-5 pb-8 pt-3">
            <button
              onClick={saveNewEvent}
              className="w-full font-quicksand font-bold py-4 rounded-2xl"
              style={{
                background: newTitle.trim() ? '#272724' : '#C0C0C0',
                color: '#FFFEFA',
                fontSize: 16,
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
