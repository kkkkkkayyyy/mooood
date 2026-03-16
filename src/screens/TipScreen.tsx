import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function TipScreen({ onNavigate }: Props) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-between px-5 pt-44 pb-80"
      style={{ background: '#FFFEFA' }}
    >
      {/* Animated dots loading indicator */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-1" style={{ height: 72 }}>
          {['o', 'o', 'o', 'o'].map((char, i) => (
            <span
              key={i}
              className="font-chewy"
              style={{
                fontSize: 64,
                color: '#9CADFF',
                display: 'inline-block',
                animation: `float-blob ${0.8 + i * 0.2}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <p
          className="font-chewy uppercase tracking-widest"
          style={{ fontSize: 18, color: '#9CADFF', letterSpacing: '0.15em' }}
        >
          cargando...
        </p>
      </div>

      {/* Did you know fact */}
      <div className="flex flex-col gap-3 text-center">
        <h2 className="font-chewy text-3xl leading-snug" style={{ color: '#272724' }}>
          ¿Sabías que...
        </h2>
        <p
          className="font-quicksand text-base leading-relaxed"
          style={{ color: '#272724', opacity: 0.85 }}
        >
          el nervio trigémino conecta los músculos de tu mandíbula directamente con el
          centro del estrés en tu cerebro?
        </p>
      </div>
    </div>
  )
}
