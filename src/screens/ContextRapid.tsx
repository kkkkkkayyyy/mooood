import { useState } from 'react'
import { X } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'

interface Props { onNavigate: (screen: Screen) => void; contextEventName?: string; onSave?: (title: string, time: string) => void }

const BASE_CHIPS = ['Trabajo', 'Mente', 'Familia', 'Hobby', 'Salud', 'Ejercicio', 'Otro']

function nowHHMM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function ContextRapid({ onNavigate, contextEventName, onSave }: Props) {
  const chips = contextEventName ? [contextEventName, ...BASE_CHIPS] : BASE_CHIPS
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')
  const [title, setTitle] = useState(contextEventName || '')
  const [time, setTime] = useState(nowHHMM)

  function toggle(chip: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(chip) ? next.delete(chip) : next.add(chip)
      return next
    })
  }

  return (
    <div className='flex-1 flex flex-col overflow-hidden' style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className='flex-shrink-0 px-5 pt-14'>
        <div className='flex items-center justify-between mb-2'>
          <button
            onClick={() => onNavigate('calm-method')}
            className='font-quicksand font-bold opacity-70 text-base'
            style={{ color: '#272724' }}
          >
            {'< Atrás'}
          </button>
          <button onClick={() => onNavigate('home')} className='flex items-center justify-center w-12 h-12'>
            <X size={22} strokeWidth={2} color='#272724' opacity={0.7} />
          </button>
        </div>
        <ProgressBar total={5} current={5} />
        <div className='py-3 text-center'>
          <h1 className='font-chewy' style={{ fontSize: 26, color: '#272724', lineHeight: 1.2 }}>
            Entendido, ¿cuándo has tenido esta sensación?
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto scroll-hide px-5 pb-4'>
        {/* Título del evento */}
        <p className='font-quicksand font-bold opacity-70 mb-2' style={{ fontSize: 18, color: '#272724' }}>
          ¿Qué estabas haciendo?
        </p>
        <input
          type='text'
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder='Título del evento...'
          className='font-quicksand w-full mb-6'
          style={{
            height: 52,
            background: '#F0F3FF',
            borderRadius: 12,
            padding: '0 16px',
            fontSize: 16,
            color: '#272724',
            border: 'none',
            outline: 'none',
          }}
        />

        {/* Influido */}
        <p className='font-quicksand font-bold opacity-70 mb-4' style={{ fontSize: 18, color: '#272724' }}>
          ¿Qué ha influido?
        </p>
        <div className='flex flex-wrap gap-x-2 gap-y-3 mb-8'>
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => toggle(chip)}
              className='font-quicksand'
              style={{
                fontSize: 16,
                color: '#272724',
                background: selected.has(chip) ? '#9CADFF' : '#E0E6FF',
                borderRadius: 30,
                padding: '8px 16px',
                transition: 'background 0.15s',
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Nota */}
        <p className='font-quicksand font-bold opacity-70 mb-4' style={{ fontSize: 18, color: '#272724' }}>
          ¿Quieres explicar que ha ocurrido?
        </p>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder='Escribe que ha pasado...'
          className='font-quicksand w-full resize-none mb-6'
          style={{
            height: 120,
            background: '#F0F3FF',
            borderRadius: 10,
            padding: 15,
            fontSize: 16,
            color: '#272724',
            border: 'none',
            outline: 'none',
          }}
        />

        {/* Hora de registro */}
        <p className='font-quicksand font-bold opacity-70 mb-2' style={{ fontSize: 18, color: '#272724' }}>
          Hora del registro
        </p>
        <div
          className='flex items-center gap-3 mb-4'
          style={{
            background: '#F0F3FF',
            borderRadius: 12,
            padding: '0 16px',
            height: 52,
          }}
        >
          <span style={{ fontSize: 20 }}>🕐</span>
          <input
            type='time'
            value={time}
            onChange={e => setTime(e.target.value)}
            className='font-quicksand flex-1'
            style={{
              fontSize: 18,
              color: '#272724',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontWeight: 600,
            }}
          />
        </div>
      </div>

      {/* Button */}
      <div className='flex-shrink-0 px-5 pb-8'>
        <button
          onClick={() => onSave ? onSave(title, time) : onNavigate('system-summary')}
          className='w-full flex items-center justify-center'
          style={{ height: 60, background: '#272724', borderRadius: 42 }}
        >
          <span className='font-quicksand font-semibold' style={{ fontSize: 20, color: '#FFFEFA' }}>
            Guardar registro
          </span>
        </button>
      </div>
    </div>
  )
}
