import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Zone = 'head' | 'throat' | 'chest' | 'stomach' | 'shoulders'

const zones: { key: Zone; label: string; cx: number; cy: number; rx: number; ry: number }[] = [
  { key: 'head',      label: 'Cabeza',   cx: 97,  cy: 52,  rx: 30, ry: 32 },
  { key: 'throat',   label: 'Garganta', cx: 97,  cy: 100, rx: 14, ry: 16 },
  { key: 'shoulders',label: 'Hombros',  cx: 97,  cy: 128, rx: 58, ry: 14 },
  { key: 'chest',    label: 'Pecho',    cx: 97,  cy: 155, rx: 34, ry: 30 },
  { key: 'stomach',  label: 'Abdomen',  cx: 97,  cy: 210, rx: 28, ry: 28 },
]

export default function BodyHeatmap({ onNavigate }: Props) {
  const [selected, setSelected] = useState<Set<Zone>>(new Set(['chest']))

  function toggle(zone: Zone) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(zone) ? next.delete(zone) : next.add(zone)
      return next
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onNavigate('intensity')}
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
        <ProgressBar total={5} current={4} />
        <div className="py-3 text-center">
          <h1 className="font-chewy text-3xl" style={{ color: '#272724', lineHeight: 1.2 }}>
            ¿Dónde lo notas?
          </h1>
          <p
            className="font-quicksand font-bold mt-1"
            style={{ fontSize: 15, color: '#272724', opacity: 0.6 }}
          >
            Toca las zonas de tu cuerpo
          </p>
        </div>
      </div>

      {/* Body + zone labels */}
      <div className="flex-1 flex flex-row items-center justify-center overflow-hidden px-4">
        {/* Zone labels left */}
        <div className="flex flex-col justify-between h-full py-8 pr-3" style={{ minHeight: 340 }}>
          {zones.map(z => (
            <button
              key={z.key}
              onClick={() => toggle(z.key)}
              className="font-quicksand text-right transition-all"
              style={{
                fontSize: 13,
                color: selected.has(z.key) ? '#F0A580' : '#656359',
                fontWeight: selected.has(z.key) ? 700 : 500,
                opacity: selected.has(z.key) ? 1 : 0.55,
                lineHeight: 1,
              }}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* SVG body silhouette */}
        <svg
          viewBox="0 0 194 420"
          width={170}
          height={370}
          style={{ overflow: 'visible', flexShrink: 0 }}
        >
          {/* Body silhouette */}
          <g opacity="0.85">
            {/* Head */}
            <ellipse cx="97" cy="52" rx="30" ry="32" fill="#C2CDFF" />
            {/* Neck */}
            <rect x="85" y="80" width="24" height="22" rx="6" fill="#C2CDFF" />
            {/* Torso */}
            <path
              d="M39 118 C39 110 55 104 97 104 C139 104 155 110 155 118
                 L162 240 C162 252 150 260 97 260 C44 260 32 252 32 240 Z"
              fill="#C2CDFF"
            />
            {/* Left arm */}
            <path
              d="M39 120 C28 122 18 130 14 148 L8 200 C6 210 10 218 18 218
                 L26 218 C32 218 36 212 36 206 L36 165 C36 148 37 135 39 120 Z"
              fill="#C2CDFF"
            />
            {/* Right arm */}
            <path
              d="M155 120 C166 122 176 130 180 148 L186 200 C188 210 184 218 176 218
                 L168 218 C162 218 158 212 158 206 L158 165 C158 148 157 135 155 120 Z"
              fill="#C2CDFF"
            />
            {/* Left hand */}
            <ellipse cx="17" cy="226" rx="9" ry="11" fill="#C2CDFF" />
            {/* Right hand */}
            <ellipse cx="177" cy="226" rx="9" ry="11" fill="#C2CDFF" />
            {/* Left leg */}
            <path
              d="M55 258 L48 370 C47 380 53 388 63 388 L73 388 C81 388 86 381 84 372
                 L80 290 L80 258 Z"
              fill="#C2CDFF"
            />
            {/* Right leg */}
            <path
              d="M139 258 L146 370 C147 380 141 388 131 388 L121 388
                 C113 388 108 381 110 372 L114 290 L114 258 Z"
              fill="#C2CDFF"
            />
            {/* Left foot */}
            <ellipse cx="58" cy="394" rx="16" ry="9" fill="#C2CDFF" />
            {/* Right foot */}
            <ellipse cx="136" cy="394" rx="16" ry="9" fill="#C2CDFF" />
          </g>

          {/* Tappable highlight zones */}
          {zones.map(z => (
            <ellipse
              key={z.key}
              cx={z.cx}
              cy={z.cy}
              rx={z.rx}
              ry={z.ry}
              fill={selected.has(z.key) ? '#F0A580' : 'transparent'}
              opacity={selected.has(z.key) ? 0.55 : 0}
              onClick={() => toggle(z.key)}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
            />
          ))}
          {/* Transparent tap targets on top */}
          {zones.map(z => (
            <ellipse
              key={z.key + '-tap'}
              cx={z.cx}
              cy={z.cy}
              rx={z.rx + 6}
              ry={z.ry + 6}
              fill="transparent"
              onClick={() => toggle(z.key)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>
      </div>

      {/* Selected count feedback */}
      <div className="flex-shrink-0 px-5 pb-2 text-center">
        {selected.size > 0 && (
          <p
            className="font-quicksand"
            style={{ fontSize: 13, color: '#F0A580', opacity: 0.9 }}
          >
            {selected.size === 1
              ? '1 zona seleccionada'
              : `${selected.size} zonas seleccionadas`}
          </p>
        )}
      </div>

      {/* Save button */}
      <div className="flex-shrink-0 px-5 pb-8">
        <button
          onClick={() => onNavigate('context')}
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
