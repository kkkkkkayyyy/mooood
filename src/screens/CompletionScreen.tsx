import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  userName?: string
}

function CalmBlob() {
  return (
    <svg viewBox="0 0 160 160" width="160" height="160">
      {/* Glowing aura rings */}
      <ellipse cx="80" cy="85" rx="68" ry="62" fill="rgba(164,221,171,0.12)" />
      <ellipse cx="80" cy="85" rx="56" ry="50" fill="rgba(164,221,171,0.18)" />
      {/* Main blob */}
      <path
        d="M80,28 C104,28 124,46 128,68 C134,96 120,118 100,126
           C84,132 64,128 52,116 C38,102 34,82 40,64 C48,44 64,28 80,28 Z"
        fill="#A4DDAB"
      />
      {/* Crescent eyes */}
      <path d="M62,72 C64,68 70,68 72,72" stroke="#373D59" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M88,72 C90,68 96,68 98,72" stroke="#373D59" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Smile */}
      <path d="M66,92 C72,100 88,100 94,92" stroke="#373D59" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Rosy cheeks */}
      <ellipse cx="58" cy="86" rx="8" ry="5" fill="rgba(255,150,150,0.3)" />
      <ellipse cx="102" cy="86" rx="8" ry="5" fill="rgba(255,150,150,0.3)" />
      {/* Sparkles */}
      <circle cx="130" cy="45" r="3" fill="#F3D13F" />
      <circle cx="138" cy="55" r="2" fill="#F3D13F" />
      <circle cx="126" cy="56" r="1.5" fill="#F3D13F" />
      <circle cx="30" cy="50" r="3" fill="#9CADFF" />
      <circle cx="22" cy="60" r="2" fill="#9CADFF" />
      <circle cx="34" cy="62" r="1.5" fill="#9CADFF" />
    </svg>
  )
}

export default function CompletionScreen({ onNavigate, userName }: Props) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-between overflow-hidden px-5"
      style={{ background: '#FFFEFA' }}
    >
      {/* Top spacer */}
      <div style={{ height: 80 }} />

      {/* Main content */}
      <div className="flex flex-col items-center animate-slide-up">
        {/* Floating calm blob */}
        <div className="animate-float-blob mb-6">
          <CalmBlob />
        </div>

        <h1
          className="font-chewy text-center"
          style={{ fontSize: 38, color: '#272724', lineHeight: 1.2, marginBottom: 12 }}
        >
          Buen trabajo, {userName || 'Sofía'}
        </h1>

        <p
          className="font-quicksand text-center"
          style={{ fontSize: 16, color: '#656359', lineHeight: 1.7, maxWidth: 280 }}
        >
          Reconocer lo que sientes y tomarte un momento para regularte es una habilidad poderosa.
        </p>

        {/* Stats chips */}
        <div className="flex gap-3 mt-8">
          <div
            className="flex flex-col items-center rounded-2xl px-5 py-3"
            style={{ background: '#F0F3FF' }}
          >
            <span
              className="font-chewy"
              style={{ fontSize: 24, color: '#9CADFF' }}
            >
              72
            </span>
            <span
              className="font-quicksand"
              style={{ fontSize: 11, color: '#656359' }}
            >
              BPM final
            </span>
          </div>
          <div
            className="flex flex-col items-center rounded-2xl px-5 py-3"
            style={{ background: '#F0FAF1' }}
          >
            <span
              className="font-chewy"
              style={{ fontSize: 24, color: '#A4DDAB' }}
            >
              +15%
            </span>
            <span
              className="font-quicksand"
              style={{ fontSize: 11, color: '#656359' }}
            >
              VFC mejorada
            </span>
          </div>
          <div
            className="flex flex-col items-center rounded-2xl px-5 py-3"
            style={{ background: '#FFF5EF' }}
          >
            <span
              className="font-chewy"
              style={{ fontSize: 24, color: '#F0A580' }}
            >
              12m
            </span>
            <span
              className="font-quicksand"
              style={{ fontSize: 11, color: '#656359' }}
            >
              Sesión
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full pb-10 flex flex-col gap-3">
        <button
          onClick={() => onNavigate('home')}
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
            Volver al calendario
          </span>
        </button>
      </div>
    </div>
  )
}
