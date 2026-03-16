import { Heart } from 'lucide-react'
import SparklineChart from './SparklineChart'

type Status = 'activation' | 'recovery' | 'calm'

interface Props {
  status?: Status
  bpm?: number
  hrv?: number
}

const statusConfig = {
  activation: {
    label: 'High Activation Detected',
    sublabel: 'Tu cuerpo está encontrando su equilibrio',
    dotColor: '#F3D13F',
    glowColor: 'rgba(243, 209, 63, 0.4)',
    sparkColor: '#F3D13F',
    bg: 'rgba(255, 241, 183, 0.25)',
    border: 'rgba(243, 209, 63, 0.2)',
  },
  recovery: {
    label: 'Recovery Mode',
    sublabel: 'Tu sistema nervioso se está regulando',
    dotColor: '#A4DDAB',
    glowColor: 'rgba(164, 221, 171, 0.4)',
    sparkColor: '#A4DDAB',
    bg: 'rgba(188, 229, 193, 0.2)',
    border: 'rgba(164, 221, 171, 0.2)',
  },
  calm: {
    label: 'Estado Óptimo',
    sublabel: 'VFC en rango coherente',
    dotColor: '#9CADFF',
    glowColor: 'rgba(156, 173, 255, 0.4)',
    sparkColor: '#9CADFF',
    bg: 'rgba(240, 243, 255, 0.4)',
    border: 'rgba(156, 173, 255, 0.25)',
  },
}

export default function BiometricHeader({ status = 'activation', bpm = 72, hrv = 65 }: Props) {
  const config = statusConfig[status]

  return (
    <div
      className="mx-4 mb-3 rounded-2xl p-4"
      style={{
        background: config.bg,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${config.border}`,
      }}
    >
      {/* Status row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex items-center justify-center">
          {/* Glow ring */}
          <div
            className="absolute rounded-full animate-ripple"
            style={{
              width: 20,
              height: 20,
              background: config.dotColor,
              opacity: 0.3,
            }}
          />
          {/* Status dot */}
          <div
            className="animate-status-pulse rounded-full z-10 relative"
            style={{
              width: 10,
              height: 10,
              background: config.dotColor,
              boxShadow: `0 0 8px ${config.glowColor}`,
            }}
          />
        </div>
        <div className="flex-1">
          <p className="font-quicksand font-bold text-sm" style={{ color: '#272724', lineHeight: 1.2 }}>
            {config.label}
          </p>
          <p className="font-quicksand text-xs" style={{ color: '#656359', lineHeight: 1.3 }}>
            {config.sublabel}
          </p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="flex items-end gap-4">
        {/* BPM */}
        <div className="flex items-center gap-1.5">
          <Heart size={14} style={{ color: config.dotColor }} fill={config.dotColor} />
          <div>
            <span className="font-quicksand font-bold text-xl" style={{ color: '#272724' }}>
              {bpm}
            </span>
            <span className="font-quicksand text-xs ml-0.5" style={{ color: '#656359' }}>
              BPM
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8" style={{ background: 'rgba(39,39,36,0.12)' }} />

        {/* HRV */}
        <div>
          <span className="font-quicksand font-bold text-xl" style={{ color: '#272724' }}>
            {hrv}
          </span>
          <span className="font-quicksand text-xs ml-0.5" style={{ color: '#656359' }}>
            ms HRV
          </span>
          <p className="font-quicksand text-xs mt-0.5" style={{ color: config.dotColor }}>
            +15% baseline
          </p>
        </div>

        {/* Sparkline */}
        <div className="flex-1" style={{ marginBottom: 2 }}>
          <SparklineChart color={config.sparkColor} height={36} />
        </div>
      </div>
    </div>
  )
}
