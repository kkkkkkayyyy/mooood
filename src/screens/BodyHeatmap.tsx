import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'
import personaImg from '../assets/persona.png'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Zone = 'head' | 'throat' | 'chest' | 'stomach' | 'shoulders'

const zones: { key: Zone; label: string; cx: number; cy: number; rx: number; ry: number }[] = [
  { key: 'head',      label: 'Cabeza',   cx: 162, cy: 58,  rx: 38, ry: 40 },
  { key: 'throat',   label: 'Garganta', cx: 162, cy: 118, rx: 22, ry: 18 },
  { key: 'shoulders',label: 'Hombros',  cx: 162, cy: 155, rx: 90, ry: 22 },
  { key: 'chest',    label: 'Pecho',    cx: 162, cy: 205, rx: 52, ry: 42 },
  { key: 'stomach',  label: 'Abdomen',  cx: 162, cy: 278, rx: 44, ry: 40 },
]

export default function BodyHeatmap({ onNavigate }: Props) {
  const [selected, setSelected] = useState<Set<Zone>>(new Set())

  function toggle(zone: Zone) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(zone) ? next.delete(zone) : next.add(zone)
      return next
    })
  }

  const selectedLabels = zones.filter(z => selected.has(z.key)).map(z => z.label)

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>

      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('intensity')}
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

        <div className="mt-6 text-center px-2">
          <h1 className="font-chewy" style={{ fontSize: 32, color: '#272724', lineHeight: 1.2 }}>
            Entendido. Vamos a localizar esa sensación.
          </h1>
          <p
            className="font-quicksand font-bold mt-3"
            style={{ fontSize: 18, color: '#272724', opacity: 0.7 }}
          >
            ¿Dónde lo notas?
          </p>
        </div>
      </div>

      {/* Body figure — centered, full width */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        <div style={{ position: 'relative', width: '100%', maxWidth: 300, aspectRatio: '300/426' }}>
          {/* Body image */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              src={personaImg}
              alt="figura humana"
              style={{
                position: 'absolute',
                top: 0,
                left: '-19.69%',
                width: '139.38%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.65,
              }}
            />
          </div>

          {/* SVG tap zones overlay */}
          <svg
            viewBox="0 0 325 426"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            {zones.map(z => (
              <g key={z.key} onClick={() => toggle(z.key)} style={{ cursor: 'pointer' }}>
                {/* Visible highlight */}
                <ellipse
                  cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
                  fill={selected.has(z.key) ? '#F0A580' : 'transparent'}
                  opacity={selected.has(z.key) ? 0.65 : 0}
                  style={{ transition: 'opacity 0.2s' }}
                />
                {/* Hit target */}
                <ellipse
                  cx={z.cx} cy={z.cy} rx={z.rx + 10} ry={z.ry + 10}
                  fill="transparent"
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Selected zones chips */}
        {selectedLabels.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {selectedLabels.map(label => (
              <span
                key={label}
                className="font-quicksand font-bold"
                style={{
                  fontSize: 13,
                  color: '#F0A580',
                  background: 'rgba(240,165,128,0.12)',
                  borderRadius: 20,
                  padding: '4px 12px',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex-shrink-0 px-5 pb-8">
        <button
          onClick={() => onNavigate('context')}
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
