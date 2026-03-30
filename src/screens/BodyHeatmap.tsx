import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'
import personaImg from '../assets/persona.png'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Zone = 'head' | 'neck' | 'chest' | 'heart' | 'stomach'

const zones: { key: Zone; label: string; cx: number; cy: number }[] = [
  { key: 'head',    label: 'Cabeza',   cx: 163, cy: 55  },
  { key: 'neck',    label: 'Cuello',   cx: 163, cy: 112 },
  { key: 'chest',   label: 'Pecho',    cx: 148, cy: 165 },
  { key: 'heart',   label: 'Corazón',  cx: 193, cy: 152 },
  { key: 'stomach', label: 'Estómago', cx: 163, cy: 215 },
]

export default function BodyHeatmap({ onNavigate }: Props) {
  const [intensity, setIntensity] = useState<Map<Zone, 1 | 2>>(new Map())

  function toggle(zone: Zone) {
    setIntensity(prev => {
      const next = new Map(prev)
      const current = next.get(zone)
      if (!current) next.set(zone, 1)
      else if (current === 1) next.set(zone, 2)
      else next.delete(zone)
      return next
    })
  }

  const selectedLabels = zones.filter(z => intensity.has(z.key)).map(z => z.label)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>

      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('emotion-step2')}
            className="font-quicksand font-bold opacity-70"
            style={{ fontSize: 16, color: '#272724', height: 50 }}
          >
            {'< Atrás'}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center font-quicksand font-bold opacity-70"
            style={{ fontSize: 32, color: '#272724', width: 50, height: 50, lineHeight: 1 }}
          >
            x
          </button>
        </div>

        <ProgressBar total={5} current={4} />

        <div className="mt-3 text-center px-2">
          <h1 className="font-chewy" style={{ fontSize: 26, color: '#272724', lineHeight: 1.2 }}>
            Entendido. Vamos a localizar esa sensación.
          </h1>
          <p
            className="font-quicksand font-bold mt-2"
            style={{ fontSize: 16, color: '#272724', opacity: 0.7 }}
          >
            ¿Dónde lo notas?
          </p>
        </div>
      </div>

      {/* Body figure — centered, full width */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-2 min-h-0">
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Body image — natural size capped at 200px wide */}
          <img
            src={personaImg}
            alt="figura humana"
            style={{ display: 'block', width: 340, height: 'auto', opacity: 0.65 }}
          />

          {/* SVG tap zones overlay — positioned over img */}
          <svg
            viewBox="0 0 325 426"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            {zones.map(z => {
              const level = intensity.get(z.key)
              const active = !!level
              return (
                <g key={z.key} onClick={() => toggle(z.key)}>
                  {/* Outer light circle — hidden until active */}
                  <circle
                    cx={z.cx} cy={z.cy} r={20}
                    fill="rgba(156,173,255,0.25)"
                    opacity={active ? 1 : 0}
                    style={{ transition: 'opacity 0.2s' }}
                  />
                  {/* Inner solid blue — scales to fill outer at intensity 2 */}
                  <circle
                    cx={z.cx} cy={z.cy} r={20}
                    fill="#9CADFF"
                    opacity={active ? 1 : 0}
                    style={{
                      transform: `scale(${level === 2 ? 1 : 0.68})`,
                      transformOrigin: `${z.cx}px ${z.cy}px`,
                      transition: 'transform 0.3s ease, opacity 0.2s',
                    }}
                  />
                  {/* Transparent hit target */}
                  <circle cx={z.cx} cy={z.cy} r={26} fill="transparent" style={{ cursor: 'pointer' }} />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Selected zones chips — always reserves space */}
        <div className="flex flex-wrap justify-center gap-2 mt-4" style={{ minHeight: 32 }}>
          {selectedLabels.map(label => (
            <span
              key={label}
              className="font-quicksand font-bold"
              style={{
                fontSize: 13,
                color: '#4782D5',
                background: 'rgba(156,173,255,0.15)',
                borderRadius: 20,
                padding: '4px 12px',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex-shrink-0 px-5 pb-8">
        <button
          onClick={() => onNavigate('intensity')}
          className="w-full flex items-center justify-center"
          style={{ height: 60, background: '#272724', borderRadius: 42 }}
        >
          <span className="font-quicksand font-semibold" style={{ fontSize: 20, color: '#FFFEFA' }}>
            Guardar registro
          </span>
        </button>
      </div>
    </div>
  )
}
