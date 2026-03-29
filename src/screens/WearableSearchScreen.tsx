import { useState, useEffect } from 'react'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  onConnected: () => void
  returnTo: Screen
}

type SearchState = 'searching' | 'found' | 'linked'

const FAKE_DEVICES = [
  { name: 'Apple Watch Series 9', icon: '⌚' },
  { name: 'Garmin Forerunner 265', icon: '⌚' },
  { name: 'Fitbit Sense 2', icon: '⌚' },
  { name: 'Samsung Galaxy Watch 6', icon: '⌚' },
  { name: 'Oura Ring Gen 3', icon: '💍' },
]

export default function WearableSearchScreen({ onNavigate, onConnected, returnTo }: Props) {
  const [state, setState] = useState<SearchState>('searching')
  const [device, setDevice] = useState(() => FAKE_DEVICES[Math.floor(Math.random() * FAKE_DEVICES.length)])
  const [dots, setDots] = useState('')

  // Animated dots while searching
  useEffect(() => {
    if (state !== 'searching') return
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [state])

  // Auto-find device after 2.5s
  useEffect(() => {
    const t = setTimeout(() => setState('found'), 2500)
    return () => clearTimeout(t)
  }, [])

  function handleLink() {
    setState('linked')
    setTimeout(() => {
      onConnected()
      onNavigate(returnTo)
    }, 1200)
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-8 pt-16 pb-14" style={{ background: '#FFFEFA' }}>

      {/* Back button */}
      {state !== 'linked' && (
        <div className="w-full flex justify-start mb-4">
          <button onClick={() => onNavigate(returnTo)} className="font-quicksand" style={{ fontSize: 14, color: '#9B9789' }}>
            ← Volver
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">

        {state === 'searching' && (
          <>
            {/* Pulsing radar animation */}
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 60 + i * 40,
                    height: 60 + i * 40,
                    border: '1.5px solid #9CADFF',
                    opacity: 0.15 + (2 - i) * 0.2,
                    animation: `ping ${1.2 + i * 0.4}s cubic-bezier(0,0,0.2,1) infinite`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
              {/* Center dot */}
              <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: '#ECEEFF' }}>
                <span style={{ fontSize: 26 }}>⌚</span>
              </div>
            </div>

            <div className="text-center">
              <p className="font-chewy" style={{ fontSize: 24, color: '#272724' }}>
                Buscando dispositivos{dots}
              </p>
              <p className="font-quicksand mt-2" style={{ fontSize: 13, color: '#9B9789' }}>
                Asegúrate de que tu wearable está cerca y encendido
              </p>
            </div>
          </>
        )}

        {state === 'found' && (
          <>
            <div className="flex flex-col items-center gap-5 w-full">
              {/* Found animation */}
              <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
                <div className="absolute rounded-full" style={{ width: 120, height: 120, background: '#ECEEFF' }} />
                <span style={{ fontSize: 46, position: 'relative' }}>{device.icon}</span>
                {/* Green checkmark badge */}
                <div
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ width: 28, height: 28, background: '#4CAF50', bottom: 4, right: 4, border: '2px solid #FFFEFA' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="text-center">
                <p className="font-quicksand font-bold" style={{ fontSize: 13, color: '#9B9789', letterSpacing: 1, textTransform: 'uppercase' }}>
                  Dispositivo encontrado
                </p>
                <p className="font-chewy mt-1" style={{ fontSize: 26, color: '#272724' }}>
                  {device.name}
                </p>
              </div>

              {/* Device card */}
              <div className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl" style={{ background: '#F0F3FF' }}>
                <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: 44, height: 44, background: '#ECEEFF' }}>
                  <span style={{ fontSize: 22 }}>{device.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-quicksand font-semibold" style={{ fontSize: 14, color: '#272724' }}>{device.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50' }} />
                    <p className="font-quicksand" style={{ fontSize: 11, color: '#9B9789' }}>Listo para vincular</p>
                  </div>
                </div>
                <span className="font-quicksand" style={{ fontSize: 11, color: '#9CADFF' }}>100%</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleLink}
                className="w-full font-quicksand font-bold py-4 rounded-full"
                style={{ background: '#272724', color: '#FFFEFA', fontSize: 16 }}
              >
                Vincular
              </button>
              <button
                onClick={() => {
                  setDevice(FAKE_DEVICES[Math.floor(Math.random() * FAKE_DEVICES.length)])
                  setState('searching')
                  setTimeout(() => setState('found'), 2500)
                }}
                className="w-full font-quicksand font-medium py-3 rounded-full"
                style={{ background: '#F0F0F0', color: '#272724', fontSize: 14 }}
              >
                No es este, seguir buscando
              </button>
              <button
                onClick={() => onNavigate(returnTo)}
                className="w-full font-quicksand font-medium py-2"
                style={{ background: 'transparent', color: '#9B9789', fontSize: 13 }}
              >
                Ahora no
              </button>
            </div>
          </>
        )}

        {state === 'linked' && (
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center justify-center rounded-full" style={{ width: 100, height: 100, background: '#BCE5C1' }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M10 24L20 34L38 14" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-chewy text-center" style={{ fontSize: 26, color: '#272724' }}>¡{device.name} vinculado!</p>
            <p className="font-quicksand text-center" style={{ fontSize: 14, color: '#9B9789' }}>Ya puedes ver tus datos en tiempo real</p>
          </div>
        )}
      </div>
    </div>
  )
}
