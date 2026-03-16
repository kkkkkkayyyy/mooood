import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

const CHIPS = [
  { key: 'presentacion', label: 'Presentación' },
  { key: 'trabajo',      label: 'Trabajo' },
  { key: 'mente',        label: 'Mente' },
  { key: 'familia',      label: 'Familia' },
  { key: 'hobby',        label: 'Hobby' },
  { key: 'salud',        label: 'Salud' },
  { key: 'ejercicio',    label: 'Ejercicio' },
  { key: 'otro',         label: 'Otro' },
]

export default function ContextScreen({ onNavigate }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(['presentacion']))
  const [text, setText] = useState('')

  function toggle(key: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onNavigate('body-heatmap')}
            className="font-quicksand font-bold opacity-70 text-base"
            style={{ color: '#272724' }}
          >
            {'< Atrás'}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center w-12 h-12"
          >
            <span
              className="font-quicksand font-bold opacity-70"
              style={{ fontSize: 28, color: '#272724', lineHeight: 1 }}
            >
              ×
            </span>
          </button>
        </div>
        <ProgressBar total={5} current={5} />
        <div className="py-3">
          <h1 className="font-chewy text-3xl" style={{ color: '#272724', lineHeight: 1.2 }}>
            ¿Qué ha influido?
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-hide px-5 pb-4">
        {/* Chip tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CHIPS.map(({ key, label }) => {
            const active = selected.has(key)
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className="font-quicksand font-semibold card-press transition-all"
                style={{
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 16,
                  paddingRight: 16,
                  borderRadius: 24,
                  fontSize: 14,
                  background: active ? '#E0E6FF' : '#F0F3FF',
                  color: active ? '#373D59' : '#656359',
                  border: active ? '1.5px solid #9CADFF' : '1.5px solid transparent',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Text area */}
        <div>
          <p
            className="font-quicksand font-bold mb-2"
            style={{ fontSize: 15, color: '#272724', opacity: 0.75 }}
          >
            ¿Quieres explicar qué ha ocurrido?
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Escribe aquí lo que sientes o lo que ha pasado..."
            rows={5}
            className="w-full font-quicksand resize-none outline-none"
            style={{
              background: '#F0F3FF',
              borderRadius: 16,
              padding: '14px 16px',
              fontSize: 14,
              color: '#272724',
              border: 'none',
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>

      {/* Save button */}
      <div className="flex-shrink-0 px-5 pb-8">
        <button
          onClick={() => onNavigate('tip')}
          className="w-full flex items-center justify-center"
          style={{
            height: 60,
            background: '#272724',
            borderRadius: 42,
          }}
        >
          <span
            className="font-quicksand font-semibold"
            style={{ fontSize: 20, color: '#FFFEFA' }}
          >
            Guardar registro
          </span>
        </button>
      </div>
    </div>
  )
}
