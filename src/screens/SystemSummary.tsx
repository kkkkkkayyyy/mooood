import { Zap, Activity, TrendingUp } from 'lucide-react'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
}

const insights = [
  {
    icon: Zap,
    color: '#9CADFF',
    bg: '#F0F3FF',
    title: 'Detonante',
    description:
      'Tu cuerpo detectó la presentación de hoy como un evento de alta demanda. El aumento de activación comenzó 40 minutos antes.',
  },
  {
    icon: Activity,
    color: '#F0A580',
    bg: '#FFF5EF',
    title: 'Reacción',
    description:
      'Tensión en pecho y hombros, ritmo cardíaco elevado a 72bpm. Tu sistema nervioso activó el modo de alerta anticipatoria.',
  },
  {
    icon: TrendingUp,
    color: '#A4DDAB',
    bg: '#F0FAF1',
    title: 'Resultado',
    description:
      'La respiración guiada redujo tu nivel de activación. Tu VFC mejoró en +15% respecto al inicio del ejercicio.',
  },
]

export default function SystemSummary({ onNavigate }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="font-chewy text-2xl"
            style={{ color: '#272724', lineHeight: 1.2 }}
          >
            Esto es lo que está
            <br />
            pasando en tu sistema:
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
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto scroll-hide px-5 pb-4">
        <div className="flex flex-col gap-4">
          {insights.map(({ icon: Icon, color, bg, title, description }) => (
            <div
              key={title}
              className="rounded-2xl p-4 animate-slide-up"
              style={{ background: bg }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: 40,
                    height: 40,
                    background: color,
                  }}
                >
                  <Icon size={20} color="#FFFEFA" strokeWidth={2.5} />
                </div>
                <span
                  className="font-quicksand font-bold"
                  style={{ fontSize: 17, color: '#272724' }}
                >
                  {title}
                </span>
              </div>
              <p
                className="font-quicksand"
                style={{ fontSize: 14, color: '#656359', lineHeight: 1.6 }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Biometric note */}
        <div
          className="mt-4 rounded-2xl p-4"
          style={{ background: 'rgba(156,173,255,0.08)', border: '1px solid rgba(156,173,255,0.2)' }}
        >
          <p
            className="font-quicksand text-center"
            style={{ fontSize: 12, color: '#656359', lineHeight: 1.6, opacity: 0.8 }}
          >
            Datos biométricos registrados a las 14:23 · BPM 72 · HRV 65ms
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-5 pb-8">
        <button
          onClick={() => onNavigate('completion')}
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
            Entendido
          </span>
        </button>
      </div>
    </div>
  )
}
