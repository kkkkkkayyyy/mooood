import { useState } from 'react'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  onComplete: (wearableConnected: boolean) => void
}

const SLIDES = [
  {
    title: 'Estoy aquí contigo',
    body: 'Cuando tu wearable detecta ansiedad, abrimos este espacio para que pares un momento y te des cuenta de cómo estás. No somos una app clínica, solo un lugar para acompañarte.',
  },
  {
    title: 'Ponerle nombre ayuda',
    body: 'Te invitamos a registrar lo que sientes justo cuando está pasando.\nA veces escribirlo ya cambia algo.',
  },
  {
    title: 'Con el tiempo, todo empieza a tener sentido',
    body: 'Tus registros se convierten en patrones.\nMomentos, emociones, ritmos.',
  },
]

function MoooodLogo() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="font-chewy"
        style={{ fontSize: 48, color: '#9CADFF', letterSpacing: 1, lineHeight: 1 }}
      >
        Mooood
      </span>
      {/* Smile */}
      <svg width="48" height="16" viewBox="0 0 48 16" fill="none">
        <path d="M6 2 Q24 18 42 2" stroke="#9CADFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

function Dots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === active ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background: i === active ? '#9CADFF' : '#D0D0D0',
            transition: 'all 0.3s',
          }}
        />
      ))}
    </div>
  )
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  return (
    <div className="flex-1 flex flex-col items-center px-8 pt-16 pb-10" style={{ background: '#FFFEFA' }}>
      {/* Logo */}
      <MoooodLogo />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 mt-10">
        <h2
          className="font-chewy text-center"
          style={{ fontSize: 26, color: '#272724', lineHeight: 1.25 }}
        >
          {slide.title}
        </h2>
        <p
          className="font-quicksand text-center"
          style={{ fontSize: 14, color: '#656359', lineHeight: 1.7, whiteSpace: 'pre-line' }}
        >
          {slide.body}
        </p>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col items-center gap-4 mt-6">
        <button
          onClick={() => isLast ? onComplete(false) : setStep(s => s + 1)}
          className="w-full font-quicksand font-bold py-4 rounded-full"
          style={{ background: '#272724', color: '#FFFEFA', fontSize: 16 }}
        >
          Continuar
        </button>

        <button
          onClick={() => onComplete(false)}
          className="font-quicksand"
          style={{ fontSize: 14, color: '#9B9789' }}
        >
          Skip
        </button>

        <Dots total={SLIDES.length} active={step} />
      </div>
    </div>
  )
}
