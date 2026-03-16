import { useState, useEffect } from 'react'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Phase = 'inhala' | 'sostén' | 'exhala'

const PHASES: { phase: Phase; label: string; sublabel: string; duration: number }[] = [
  { phase: 'inhala', label: 'Inhala', sublabel: 'por la nariz', duration: 4000 },
  { phase: 'sostén', label: 'Sostén', sublabel: 'suavemente', duration: 2000 },
  { phase: 'exhala', label: 'Exhala', sublabel: 'por la boca', duration: 6000 },
]

export default function CalmMethod({ onNavigate }: Props) {
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const current = PHASES[phaseIdx]
    const t = setTimeout(() => {
      const next = (phaseIdx + 1) % PHASES.length
      if (next === 0) setCycle(c => c + 1)
      setPhaseIdx(next)
    }, current.duration)
    return () => clearTimeout(t)
  }, [phaseIdx])

  const { phase, label, sublabel } = PHASES[phaseIdx]

  const ringBaseSize = 200
  const ringScale = phase === 'inhala' ? 1.15 : phase === 'sostén' ? 1.15 : 1.0

  const ringLayers = [
    { size: ringBaseSize * 1.4,  opacity: 0.10, delay: '0s' },
    { size: ringBaseSize * 1.2,  opacity: 0.16, delay: '0.2s' },
    { size: ringBaseSize * 1.05, opacity: 0.24, delay: '0.4s' },
    { size: ringBaseSize,        opacity: 0.85, delay: '0.6s' },
  ]

  const phaseColor: Record<Phase, string> = {
    'inhala': '#9CADFF',
    'sostén': '#A4DDAB',
    'exhala': '#9CC4FF',
  }

  const color = phaseColor[phase]

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden"
      style={{ background: '#FFFEFA' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex items-center justify-between mb-2">
          <div style={{ width: 60 }} />
          <h1
            className="font-chewy text-2xl text-center"
            style={{ color: '#272724', lineHeight: 1.2 }}
          >
            Método de calma
          </h1>
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
        <p
          className="font-quicksand text-center mt-1"
          style={{ fontSize: 14, color: '#656359' }}
        >
          Sigue el círculo con la respiración
        </p>
      </div>

      {/* Breathing circles */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
          {ringLayers.map((ring, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: ring.size,
                height: ring.size,
                background: color,
                opacity: ring.opacity,
                transition: `transform ${phase === 'inhala' ? 4 : phase === 'sostén' ? 0.5 : 6}s ease-in-out, opacity 0.8s ease`,
                transform: `scale(${i === ringLayers.length - 1 ? ringScale : ringScale * (0.92 + i * 0.03)})`,
                animationDelay: ring.delay,
              }}
            />
          ))}
          {/* Center text */}
          <div className="absolute z-10 flex flex-col items-center">
            <span
              className="font-chewy"
              style={{ fontSize: 36, color: '#FFFEFA', lineHeight: 1 }}
            >
              {label}
            </span>
            <span
              className="font-quicksand mt-1"
              style={{ fontSize: 13, color: 'rgba(255,254,250,0.75)' }}
            >
              {sublabel}
            </span>
          </div>
        </div>

        {/* Cycle counter */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: 8,
                height: 8,
                background: i < cycle % 3 + 1 ? color : 'rgba(156,173,255,0.25)',
              }}
            />
          ))}
        </div>
        <p
          className="font-quicksand mt-2"
          style={{ fontSize: 12, color: '#656359' }}
        >
          Ciclo {cycle + 1}
        </p>
      </div>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-5 pb-8 flex flex-col gap-3">
        <button
          onClick={() => onNavigate('system-summary')}
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
            Estoy mejor
          </span>
        </button>
        <button
          onClick={() => onNavigate('system-summary')}
          className="w-full flex items-center justify-center"
        >
          <span
            className="font-quicksand font-semibold underline"
            style={{ fontSize: 14, color: '#272724', opacity: 0.6 }}
          >
            Necesito otro método
          </span>
        </button>
      </div>
    </div>
  )
}
