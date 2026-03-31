import { useState, useRef } from 'react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function IntensityScreen({ onNavigate }: Props) {
  const [intensity, setIntensity] = useState(3) // 1-5 scale
  const containerRef = useRef<HTMLDivElement>(null)

  // Map intensity 1-5 to ring sizes, scaled to fit screen
  const maxRing = 280
  const ringScale = Math.min((window.innerWidth - 40) / maxRing, 1)
  const ringSizes = [280, 230, 175, 120, 70].map(s => Math.round(s * ringScale))

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!(e.buttons === 1 || e.type === 'pointermove' && e.pressure > 0)) return
    const rect = containerRef.current!.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2)
    const maxDist = ringSizes[0] / 2
    const clamped = Math.min(maxDist, Math.max(0, dist))
    const level = Math.round((clamped / maxDist) * 4) + 1
    setIntensity(level)
  }

  const ringColors = [
    'rgba(156,173,255,0.12)',
    'rgba(156,173,255,0.18)',
    'rgba(156,173,255,0.26)',
    'rgba(156,173,255,0.36)',
    'rgba(156,173,255,0.9)',
  ]

  const labelMap: Record<number, string> = {
    1: 'Muy leve',
    2: 'Leve',
    3: 'Moderado',
    4: 'Intenso',
    5: 'Muy intenso',
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => onNavigate('pre-calm')}
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
        <ProgressBar total={5} current={3} />
        <div className="py-3 text-center">
          <h1 className="font-chewy text-3xl" style={{ color: '#272724', lineHeight: 1.2 }}>
            Hagamos un check-in rápido
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between overflow-hidden px-5 pb-8">
        <p
          className="font-quicksand font-bold text-center mt-1 mb-4"
          style={{ fontSize: 16, color: '#272724', opacity: 0.7 }}
        >
          ¿Cuánto espacio ocupa en ti ahora?
        </p>

        {/* Concentric rings */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center flex-1 w-full cursor-pointer select-none"
          style={{ touchAction: 'none', maxHeight: 300 }}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
        >
          {ringSizes.map((size, i) => {
            const ringIndex = 4 - i // outermost = index 0
            const isActive = intensity > ringIndex
            return (
              <div
                key={i}
                className="absolute rounded-full transition-all duration-300"
                style={{
                  width: size,
                  height: size,
                  background: isActive ? ringColors[ringIndex] : 'transparent',
                  border: `1.5px solid ${isActive ? 'rgba(156,173,255,0.5)' : 'rgba(156,173,255,0.2)'}`,
                  animation: isActive ? `breathe-ring-${Math.min(i + 1, 3)} 6s ease-in-out infinite` : 'none',
                }}
              />
            )
          })}
          {/* Center dot */}
          <div
            className="absolute rounded-full z-10"
            style={{
              width: 70,
              height: 70,
              background: 'rgba(156,173,255,0.9)',
              boxShadow: '0 0 20px rgba(156,173,255,0.5)',
              animation: 'breathe-center 6s ease-in-out infinite',
            }}
          />
          {/* Intensity label inside center */}
          <span
            className="absolute z-20 font-quicksand font-bold text-center"
            style={{ fontSize: 11, color: '#373D59', width: 60, lineHeight: 1.2 }}
          >
            {labelMap[intensity]}
          </span>
        </div>

        {/* Drag label */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <p
            className="font-quicksand text-center"
            style={{ fontSize: 13, color: '#272724', opacity: 0.5 }}
          >
            Arrastra para ajustar
          </p>
          {/* Down arrow SVG */}
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path
              d="M1 1L8 8L15 1"
              stroke="#272724"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Continue */}
        <button
          onClick={() => onNavigate('pre-calm')}
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
            Continuar
          </span>
        </button>
      </div>
    </div>
  )
}
