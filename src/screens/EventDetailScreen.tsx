import { useState } from 'react'
import { ArrowLeft, Pencil, Check } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { Screen } from '../App'

export interface EventDetail {
  id: number
  time: string
  name: string
  emojiIcon: string | null
  vfc: string | null
  vfcColor?: string
  bg: string
  textColor: string
  insight: string
}

interface Props {
  onNavigate: (screen: Screen) => void
  event?: EventDetail
}

// Mini sparkline BPM chart
function BpmSparkline({ color }: { color: string }) {
  const points = [58, 62, 70, 85, 88, 78, 72, 68, 65, 70, 74, 80, 76, 70, 65]
  const w = 220
  const h = 48
  const min = Math.min(...points)
  const max = Math.max(...points)
  const xs = points.map((_, i) => (i / (points.length - 1)) * w)
  const ys = points.map(v => h - ((v - min) / (max - min)) * h)
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ')
  const areaD = `${d} L${w},${h} L0,${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="bpmGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#bpmGrad)" />
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Peak dot */}
      <circle cx={xs[4].toFixed(1)} cy={ys[4].toFixed(1)} r="4" fill={color} />
    </svg>
  )
}

// Emotion wheel icon (simplified)
function EmotionDot({ label, color, size = 36 }: { label: string; color: string; size?: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-full" style={{ width: size, height: size, background: color }} />
      <span className="font-quicksand" style={{ fontSize: 10, color: '#9B9789', textAlign: 'center', lineHeight: 1.2 }}>{label}</span>
    </div>
  )
}

export default function EventDetailScreen({ onNavigate, event }: Props) {
  if (!event) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center" style={{ background: '#FFFEFA' }}>
        <p className="font-quicksand" style={{ color: '#9B9789', fontSize: 14 }}>Sin información</p>
        <button onClick={() => onNavigate('home')} className="mt-4 font-quicksand font-semibold" style={{ color: '#9CADFF', fontSize: 14 }}>Volver</button>
      </div>
    )
  }

  const isHighVfc = event.vfc?.includes('Alta')
  // VFC Baja = verde (relajado), VFC Alta = rojo (activado/estrés)
  const bpmColor = isHighVfc ? '#E05C3A' : '#4CAF50'
  const bpmPeak = isHighVfc ? 88 : 72

  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState('')

  function saveNotes() {
    setSavedNotes(notes)
    setEditingNotes(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-14 px-5 pb-4 flex items-center gap-3">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center justify-center rounded-full"
          style={{ width: 36, height: 36, background: '#F0F0F0' }}
        >
          <ArrowLeft size={18} color="#272724" strokeWidth={2} />
        </button>
        <span className="font-quicksand font-semibold" style={{ fontSize: 16, color: '#9B9789' }}>Más información</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-hide px-5 pb-6">

        {/* Event hero card */}
        <div
          className="w-full rounded-2xl px-5 py-5 mb-5 flex items-center justify-between"
          style={{ background: event.bg }}
        >
          <div>
            <span className="font-quicksand" style={{ fontSize: 12, color: event.textColor, opacity: 0.7 }}>{event.time}</span>
            <h1 className="font-chewy mt-0.5" style={{ fontSize: 30, color: '#272724', lineHeight: 1.1 }}>{event.name}</h1>
            {event.vfc && (
              <div className="inline-flex items-center mt-2 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.65)' }}>
                <span className="font-quicksand font-semibold" style={{ fontSize: 11, color: event.vfcColor }}>{event.vfc}</span>
              </div>
            )}
          </div>
          {event.emojiIcon && (
            <span style={{ fontSize: 40 }}>{event.emojiIcon}</span>
          )}
        </div>

        {/* Insight */}
        {event.insight && (
          <div className="rounded-2xl px-4 py-4 mb-5" style={{ background: '#F0F3FF' }}>
            <p className="font-quicksand font-semibold mb-1" style={{ fontSize: 13, color: '#272724' }}>Insight del momento</p>
            <p className="font-quicksand" style={{ fontSize: 13, color: '#656359', lineHeight: 1.6 }}>{event.insight}</p>
          </div>
        )}

        {/* BPM chart */}
        <div className="rounded-2xl px-4 pt-4 pb-3 mb-5" style={{ background: '#F8F8F8' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-quicksand font-semibold" style={{ fontSize: 13, color: '#272724' }}>Frecuencia cardíaca</p>
            <div className="flex items-center gap-1.5">
              <span className="font-chewy" style={{ fontSize: 22, color: bpmColor }}>{bpmPeak}</span>
              <span className="font-quicksand" style={{ fontSize: 11, color: '#9B9789' }}>bpm pico</span>
            </div>
          </div>
          <BpmSparkline color={bpmColor} />
          <div className="flex justify-between mt-2">
            <span className="font-quicksand" style={{ fontSize: 10, color: '#C0C0C0' }}>Inicio</span>
            <span className="font-quicksand" style={{ fontSize: 10, color: '#C0C0C0' }}>Fin</span>
          </div>
        </div>

        {/* VFC detail */}
        {event.vfc && (
          <div className="rounded-2xl px-4 py-4 mb-5" style={{ background: '#F8F8F8' }}>
            <p className="font-quicksand font-semibold mb-3" style={{ fontSize: 13, color: '#272724' }}>Variabilidad de frecuencia cardíaca</p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="rounded-full flex items-center justify-center mb-1"
                  style={{ width: 56, height: 56, background: isHighVfc ? '#FFD5CC' : '#BCE5C1' }}
                >
                  <span style={{ fontSize: 24 }}>{isHighVfc ? '🔴' : '🟢'}</span>
                </div>
                <span className="font-quicksand font-bold" style={{ fontSize: 13, color: isHighVfc ? '#E05C3A' : '#4CAF50' }}>{event.vfc}</span>
              </div>
              <div className="flex-1">
                <p className="font-quicksand" style={{ fontSize: 12, color: '#656359', lineHeight: 1.55 }}>
                  {isHighVfc
                    ? 'Una VFC alta puede indicar estrés, activación del sistema nervioso simpático o un esfuerzo físico intenso.'
                    : 'Una VFC baja indica que tu sistema nervioso estaba equilibrado, en calma y en buen estado de recuperación.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Editable notes */}
        <div className="rounded-2xl px-4 py-4 mb-5" style={{ background: '#F8F8F8' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-quicksand font-semibold" style={{ fontSize: 13, color: '#272724' }}>Mis notas</p>
            {!editingNotes ? (
              <button
                onClick={() => { setNotes(savedNotes); setEditingNotes(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: '#EEEEFF' }}
              >
                <Pencil size={12} color="#9CADFF" />
                <span className="font-quicksand" style={{ fontSize: 11, color: '#9CADFF' }}>Editar</span>
              </button>
            ) : (
              <button
                onClick={saveNotes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: '#9CADFF' }}
              >
                <Check size={12} color="#272724" />
                <span className="font-quicksand font-semibold" style={{ fontSize: 11, color: '#272724' }}>Guardar</span>
              </button>
            )}
          </div>

          {editingNotes ? (
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="¿Cómo te sentiste durante este momento? Añade cualquier detalle que quieras recordar..."
              autoFocus
              rows={5}
              className="w-full font-quicksand outline-none resize-none rounded-xl px-3 py-3"
              style={{
                background: '#FFFFFF',
                fontSize: 13,
                color: '#272724',
                lineHeight: 1.6,
                border: '1.5px solid #D0D8FF',
              }}
            />
          ) : savedNotes ? (
            <p className="font-quicksand" style={{ fontSize: 13, color: '#272724', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {savedNotes}
            </p>
          ) : (
            <button
              onClick={() => { setNotes(''); setEditingNotes(true) }}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-5"
              style={{ background: '#FFFFFF', border: '1.5px dashed #D0D0D0' }}
            >
              <Pencil size={14} color="#C0C0C0" />
              <span className="font-quicksand" style={{ fontSize: 12, color: '#C0C0C0' }}>Añadir una nota sobre este momento...</span>
            </button>
          )}
        </div>

        {/* Recommendations */}
        <div className="rounded-2xl px-4 py-4 mb-2" style={{ background: '#F0F3FF' }}>
          <p className="font-quicksand font-semibold mb-2" style={{ fontSize: 13, color: '#272724' }}>Recomendación</p>
          <p className="font-quicksand" style={{ fontSize: 12, color: '#656359', lineHeight: 1.6 }}>
            {isHighVfc
              ? 'Intenta una respiración 4-7-8 o una pausa activa de 5 minutos para reducir la activación del sistema nervioso.'
              : '¡Buen estado de recuperación! Aprovecha este momento para tareas que requieran concentración y creatividad.'}
          </p>
        </div>

      </div>

      {/* Bottom Nav */}
      <BottomNav
        onNavigate={onNavigate}
        onAddPress={() => onNavigate('emotion-step1')}
        onCalendarPress={() => onNavigate('home')}
        calendarActive={true}
      />
    </div>
  )
}
