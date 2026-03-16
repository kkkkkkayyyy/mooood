import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [dotCount, setDotCount] = useState(1)

  useEffect(() => {
    const t = setInterval(() => {
      setDotCount(d => (d % 4) + 1)
    }, 350)
    return () => clearInterval(t)
  }, [])

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#9CADFF' }}
    >
      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Logo mark */}
      <div className="relative flex flex-col items-center animate-fade-in">
        {/* "M" letter with Chewy font - the BioMind wordmark */}
        <div
          className="font-chewy text-white mb-1 relative"
          style={{
            fontSize: 88,
            lineHeight: 1,
            letterSpacing: '-2px',
            textShadow: '0 4px 20px rgba(55,61,89,0.25)',
          }}
        >
          M
        </div>

        {/* Animated dots */}
        <div
          className="font-chewy text-white/80 uppercase tracking-widest mt-2"
          style={{ fontSize: 16 }}
        >
          {Array.from({ length: dotCount }).map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                animation: `float-blob ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
              }}
            >
              o
            </span>
          ))}
        </div>

        <p
          className="font-chewy uppercase text-white/70 tracking-[0.2em] mt-1"
          style={{ fontSize: 15 }}
        >
          cargando
        </p>
      </div>
    </div>
  )
}
