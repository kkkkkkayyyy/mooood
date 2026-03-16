import { useRef } from 'react'
import { Plus } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import BiometricHeader from '../components/BiometricHeader'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

const DAY_NAMES = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
const PAST_COLORS = ['#F0A580', '#A4DDAB', '#FDE478', '#9CC4FF', '#F3D13F', '#A4DDAB', '#F0A580']

function buildCalendarDays() {
  const today = new Date()
  const days = []
  for (let offset = -7; offset <= 6; offset++) {
    const d = new Date(today)
    d.setDate(today.getDate() + offset)
    const isToday = offset === 0
    const isPast = offset < 0
    days.push({
      day: DAY_NAMES[d.getDay()],
      date: d.getDate(),
      color: isToday ? '#272724' : isPast ? PAST_COLORS[Math.abs(offset) % PAST_COLORS.length] : '#F0F3FF',
      textColor: isToday ? '#FFFEFA' : isPast ? '#272724' : '#656359',
      isToday,
    })
  }
  return days
}

const calendarDays = buildCalendarDays()

// Events for today
const events = [
  {
    id: 1,
    time: '07:00',
    name: 'Gym',
    emojiIcon: '🔥',
    vfc: 'VFC Baja',
    vfcColor: '#F0A580',
    bg: '#FFCEB6',
    textColor: '#373D59',
    expanded: false,
  },
  {
    id: 2,
    time: '09:00',
    name: 'Reunión team',
    emojiIcon: '⚡',
    vfc: 'VFC Alta',
    vfcColor: '#272724',
    bg: '#FFF1B7',
    textColor: '#373D59',
    expanded: false,
  },
  {
    id: 3,
    time: '09:00',
    name: 'Coffe time',
    emojiIcon: '😌',
    vfc: 'VFC Baja',
    vfcColor: '#373D59',
    bg: '#BCE5C1',
    textColor: '#373D59',
    expanded: false,
  },
  {
    id: 4,
    time: '15:00',
    name: 'Inicio Sprint',
    emojiIcon: null,
    vfc: 'VFC Alta',
    vfcColor: '#272724',
    bg: '#EFEFEF',
    textColor: '#373D59',
    expanded: false,
  },
  {
    id: 5,
    time: '19:00',
    name: 'Presentación',
    emojiIcon: '🔥',
    vfc: 'VFC Baja',
    vfcColor: '#373D59',
    bg: '#FFCEB6',
    textColor: '#373D59',
    expanded: true,
    insight: 'El sensor detectó un pico de tensión. Registraste que te has sentido nerviosa...',
  },
  {
    id: 6,
    time: '21:00',
    name: 'Cena con amigos',
    emojiIcon: null,
    vfc: null,
    bg: '#E0E6FF',
    textColor: '#373D59',
    opacity: 0.5,
    expanded: false,
  },
]

export default function HomeScreen({ onNavigate }: Props) {
  const todayRef = useRef<HTMLDivElement>(null)

  function scrollToToday() {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-14 px-5 pb-2">
        <p
          className="font-quicksand"
          style={{ fontSize: 18, color: '#272724', lineHeight: 1.35 }}
        >
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
            <span className="font-quicksand text-xl" style={{ color: '#272724' }}>
              Mood history
            </span>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: '#9CADFF' }}
            >
              <span className="font-quicksand text-xs" style={{ color: '#272724' }}>Semana</span>
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                <path d="M1 1L3.5 4L6 1" stroke="#272724" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Calendar strip */}
          <div className="flex gap-2 px-4 overflow-x-auto scroll-hide pb-1">
            {calendarDays.map((d, i) => (
              <div key={i} ref={d.isToday ? todayRef : undefined} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <span
                  className="font-quicksand text-xs"
                  style={{ color: d.isToday ? '#272724' : '#656359' }}
                >
                  {d.day}
                </span>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 44, height: 44, background: d.color }}
                >
                  <span
                    className="font-quicksand font-medium text-sm"
                    style={{ color: d.textColor }}
                  >
                    {d.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Back to today */}
          <div className="flex justify-end px-5 mt-2">
            <span
              className="font-quicksand text-xs underline cursor-pointer"
              style={{ color: '#272724' }}
              onClick={scrollToToday}
            >
              Volver a hoy
            </span>
          </div>
        </div>

        {/* Events Section */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="font-chewy"
              style={{ fontSize: 28, color: '#272724' }}
            >
              Eventos
            </h2>
            <button
              onClick={() => onNavigate('emotion-step1')}
              className="flex items-center justify-center rounded-full"
              style={{ width: 30, height: 30, background: '#272724' }}
            >
              <Plus size={18} color="#FFFEFA" strokeWidth={2.5} />
            </button>
          </div>

          {/* Event cards */}
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
                {/* Top row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span
                      className="font-quicksand flex-shrink-0"
                      style={{ fontSize: 12, color: event.textColor }}
                    >
                      {event.time}
                    </span>
                    <span
                      className="font-quicksand font-bold truncate"
                      style={{ fontSize: 16, color: event.textColor }}
                    >
                      {event.name}
                    </span>
                    {event.emojiIcon && (
                      <span style={{ fontSize: 16 }}>{event.emojiIcon}</span>
                    )}
                  </div>
                  {event.vfc && (
                    <div
                      className="flex-shrink-0 px-2 py-1 rounded-xl"
                      style={{ background: '#FFFEFA' }}
                    >
                      <span
                        className="font-quicksand font-medium"
                        style={{ fontSize: 10, color: event.vfcColor }}
                      >
                        {event.vfc}
                      </span>
                    </div>
                  )}
                </div>

                {/* Expanded insight text */}
                {event.expanded && event.insight && (
                  <div className="mt-3">
                    <p
                      className="font-quicksand font-medium text-left"
                      style={{ fontSize: 12, color: '#272724', lineHeight: 1.5 }}
                    >
                      {event.insight}
                    </p>
                    {/* CTA button */}
                    <div
                      className="mt-4 flex items-center justify-center rounded-xl"
                      style={{
                        background: '#272724',
                        padding: '11px 32px',
                      }}
                    >
                      <span
                        className="font-quicksand font-bold"
                        style={{ fontSize: 12, color: '#FFFEFA' }}
                      >
                        Más información
                      </span>
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
