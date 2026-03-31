import { useState, useEffect } from 'react'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

type Phase = 'inhala' | 'sostén' | 'exhala' | 'sostén2'

// --- Método 1: Respiración 4-2-6 ---
const PHASES_426: { phase: Phase; label: string; sublabel: string; duration: number }[] = [
  { phase: 'inhala', label: 'Inhala', sublabel: 'por la nariz', duration: 4000 },
  { phase: 'sostén', label: 'Sostén', sublabel: 'suavemente', duration: 2000 },
  { phase: 'exhala', label: 'Exhala', sublabel: 'por la boca', duration: 6000 },
]

// --- Método 2: Respiración en caja 4-4-4-4 ---
const PHASES_BOX: { phase: Phase; label: string; sublabel: string; duration: number }[] = [
  { phase: 'inhala',  label: 'Inhala',  sublabel: '4 segundos', duration: 4000 },
  { phase: 'sostén',  label: 'Sostén',  sublabel: '4 segundos', duration: 4000 },
  { phase: 'exhala',  label: 'Exhala',  sublabel: '4 segundos', duration: 4000 },
  { phase: 'sostén2', label: 'Espera',  sublabel: '4 segundos', duration: 4000 },
]

// --- Método 3: 5-4-3-2-1 ---
const GROUNDING_STEPS = [
  { num: 5, sense: 'cosas que puedes VER',    icon: '👀' },
  { num: 4, sense: 'cosas que puedes TOCAR',  icon: '🤚' },
  { num: 3, sense: 'cosas que puedes OÍR',    icon: '👂' },
  { num: 2, sense: 'cosas que puedes OLER',   icon: '👃' },
  { num: 1, sense: 'cosa que puedes SABOREAR',icon: '👅' },
]

const METHODS = [
  { id: 'breathing426', title: 'Respiración 4-2-6',    subtitle: 'Sigue el círculo con la respiración', color: '#9CADFF' },
  { id: 'box',          title: 'Respiración en caja',  subtitle: 'Cuadrada: iguala todas las fases',    color: '#A4DDAB' },
  { id: 'grounding',    title: 'Técnica 5-4-3-2-1',    subtitle: 'Ancla tus sentidos al presente',      color: '#F0A580' },
]

// BreathingCircle — shared between methods 1 & 2
function BreathingCircle({ phases, color }: { phases: typeof PHASES_426; color: string }) {
  const [phaseIdx, setPhaseIdx] = useState(0)

  useEffect(() => {
    setPhaseIdx(0)
  }, [phases])

  useEffect(() => {
    const current = phases[phaseIdx]
    const t = setTimeout(() => setPhaseIdx(i => (i + 1) % phases.length), current.duration)
    return () => clearTimeout(t)
  }, [phaseIdx, phases])

  const { phase, label } = phases[phaseIdx]

  const innerScale = phase === 'exhala' ? 0.55 : 1.0
  const innerDuration = phase === 'inhala' ? 4 : phase === 'exhala' ? 6 : phase === 'sostén2' ? 0.3 : 0.3

  const baseSize = 340
  const containerSize = Math.min(window.innerWidth - 40, baseSize)
  const scale = containerSize / baseSize

  const staticRings = [
    { size: Math.round(330 * scale), opacity: 0.10 },
    { size: Math.round(270 * scale), opacity: 0.16 },
    { size: Math.round(215 * scale), opacity: 0.22 },
  ]

  return (
    <div className="relative flex items-center justify-center my-8" style={{ width: containerSize, height: containerSize }}>
      {staticRings.map((ring, i) => (
        <div key={i} className="absolute rounded-full" style={{ width: ring.size, height: ring.size, background: color, opacity: ring.opacity }} />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          width: Math.round(165 * scale), height: Math.round(165 * scale),
          background: color, opacity: 0.9,
          transform: `scale(${innerScale})`,
          transition: `transform ${innerDuration}s ease-in-out`,
        }}
      />
      <div className="absolute z-10 flex flex-col items-center">
        <span className="font-chewy" style={{ fontSize: 36, color: '#FFFEFA', lineHeight: 1 }}>{label}</span>
      </div>
    </div>
  )
}

// Grounding 5-4-3-2-1
function GroundingMethod({ color }: { color: string }) {
  const [step, setStep] = useState(0)
  const current = GROUNDING_STEPS[step]
  const isLast = step === GROUNDING_STEPS.length - 1

  return (
    <div className="flex flex-col items-center my-6 w-full gap-4">
      {/* Progress dots */}
      <div className="flex gap-2">
        {GROUNDING_STEPS.map((_, i) => (
          <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? color : '#E0E0E0', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Card */}
      <div className="w-full rounded-3xl flex flex-col items-center justify-center px-6 py-10 gap-4" style={{ background: color + '22', border: `2px solid ${color}44`, minHeight: 200 }}>
        <span style={{ fontSize: 56 }}>{current.icon}</span>
        <div className="text-center">
          <span className="font-chewy" style={{ fontSize: 64, color, lineHeight: 1 }}>{current.num}</span>
          <p className="font-quicksand font-semibold mt-2" style={{ fontSize: 16, color: '#272724', lineHeight: 1.4 }}>
            {current.sense}
          </p>
        </div>
      </div>

      {/* Next step button */}
      {!isLast && (
        <button
          onClick={() => setStep(s => s + 1)}
          className="font-quicksand font-semibold px-8 py-3 rounded-full"
          style={{ background: color, color: '#272724', fontSize: 14 }}
        >
          Siguiente →
        </button>
      )}
      {isLast && (
        <p className="font-quicksand text-center" style={{ fontSize: 13, color: '#9B9789' }}>
          ¡Bien hecho! Ahora vuelve a respirar con calma.
        </p>
      )}
    </div>
  )
}

export default function CalmMethod({ onNavigate }: Props) {
  const [methodIdx, setMethodIdx] = useState(0)
  const method = METHODS[methodIdx]

  function nextMethod() {
    setMethodIdx(i => (i + 1) % METHODS.length)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Nav row */}
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-hide flex flex-col items-center px-5 pb-8">

        {/* Method indicator */}
        <div className="flex gap-1.5 mt-4 mb-2">
          {METHODS.map((_, i) => (
            <div key={i} style={{ width: i === methodIdx ? 20 : 6, height: 6, borderRadius: 3, background: i === methodIdx ? method.color : '#D0D0D0', transition: 'all 0.3s' }} />
          ))}
        </div>

        <h1 className="font-chewy text-center w-full mt-1" style={{ fontSize: 28, color: '#272724', lineHeight: 1.2 }}>
          {method.title}
        </h1>
        <p className="font-quicksand font-bold text-center mt-1 opacity-70 w-full" style={{ fontSize: 15, color: '#272724' }}>
          {method.subtitle}
        </p>

        {/* Method content */}
        <div className="w-full flex flex-col items-center flex-1">
          {method.id === 'breathing426' && <BreathingCircle phases={PHASES_426} color={method.color} />}
          {method.id === 'box'          && <BreathingCircle phases={PHASES_BOX}  color={method.color} />}
          {method.id === 'grounding'    && <GroundingMethod color={method.color} />}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3 mt-4">
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
            onClick={nextMethod}
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
