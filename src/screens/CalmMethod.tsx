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

  useEffect(() => {
    const current = PHASES[phaseIdx]
    const t = setTimeout(() => {
      setPhaseIdx(i => (i + 1) % PHASES.length)
    }, current.duration)
    return () => clearTimeout(t)
  }, [phaseIdx])

  const { phase, label } = PHASES[phaseIdx]

  // Inner circle: expands on inhala, holds on sostén, shrinks on exhala
  const innerScale = phase === 'inhala' ? 1.0 : phase === 'sostén' ? 1.0 : 0.55
  const innerDuration = phase === 'inhala' ? 4 : phase === 'sostén' ? 0.3 : 6

  // Scale circles to fit available screen width (px-5 = 20px each side)
  const baseSize = 340
  const containerSize = Math.min(window.innerWidth - 40, baseSize)
  const scale = containerSize / baseSize

  // Static outer rings — always blue, no animation
  const staticRings = [
    { size: Math.round(330 * scale), opacity: 0.10 },
    { size: Math.round(270 * scale), opacity: 0.16 },
    { size: Math.round(215 * scale), opacity: 0.22 },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Nav row — same position as IntensityScreen */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('intensity')}
            className="font-quicksand font-bold opacity-70 text-base"
            style={{ color: '#272724' }}
          >
            {'< Atrás'}
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center font-quicksand font-bold opacity-70"
            style={{ fontSize: 28, color: '#272724', width: 40, height: 40, lineHeight: 1 }}
          >
            x
          </button>
        </div>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-8">
        <h1
          className="font-chewy text-center w-full"
          style={{ fontSize: 28, color: '#272724', lineHeight: 1.2 }}
        >
          Método de calma
        </h1>
        <p
          className="font-quicksand font-bold text-center mt-1 opacity-70 w-full"
          style={{ fontSize: 16, color: '#272724' }}
        >
          Sigue el círculo con la respiración
        </p>

        {/* Breathing circles */}
        <div className="relative flex items-center justify-center my-8" style={{ width: containerSize, height: containerSize }}>
          {staticRings.map((ring, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{ width: ring.size, height: ring.size, background: '#9CADFF', opacity: ring.opacity }}
            />
          ))}
          <div
            className="absolute rounded-full"
            style={{
              width: Math.round(165 * scale), height: Math.round(165 * scale),
              background: '#9CADFF', opacity: 0.9,
              transform: `scale(${innerScale})`,
              transition: `transform ${innerDuration}s ease-in-out`,
            }}
          />
          <div className="absolute z-10 flex flex-col items-center">
            <span className="font-chewy" style={{ fontSize: 36, color: '#FFFEFA', lineHeight: 1 }}>
              {label}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 mt-12">
          <button
            onClick={() => onNavigate('context-rapid')}
            className="w-full flex items-center justify-center"
            style={{ height: 60, background: '#272724', borderRadius: 42 }}
          >
            <span className="font-quicksand font-semibold" style={{ fontSize: 20, color: '#FFFEFA' }}>
              Estoy mejor
            </span>
          </button>
          <button
            onClick={() => onNavigate('context-rapid')}
            className="w-full flex items-center justify-center"
          >
            <span className="font-quicksand font-semibold underline" style={{ fontSize: 14, color: '#272724', opacity: 0.6 }}>
              Necesito otro método de relajación
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
