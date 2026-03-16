import { X } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'

import tensionImg from '../assets/Tensión.png'
import impulsoImg from '../assets/Impulso.png'
import tristezaImg from '../assets/Tristeza.png'
import calmaImg from '../assets/calma.png'

interface Props {
  onNavigate: (screen: Screen) => void
}

const emotions = [
  {
    key: 'tension',
    label: 'Tensión',
    img: tensionImg,
    nextScreen: 'emotion-step2' as Screen,
  },
  {
    key: 'impulso',
    label: 'Impulso',
    img: impulsoImg,
    nextScreen: 'intensity' as Screen,
  },
  {
    key: 'tristeza',
    label: 'Tristeza',
    img: tristezaImg,
    nextScreen: 'intensity' as Screen,
  },
  {
    key: 'calma',
    label: 'Calma',
    img: calmaImg,
    nextScreen: 'intensity' as Screen,
  },
]

export default function EmotionStep1({ onNavigate }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-14">
        <div className="flex flex-col gap-2.5">
          {/* Close button */}
          <div className="flex justify-end">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center justify-center w-12 h-12"
            >
              <X size={22} strokeWidth={2} color="#272724" opacity={0.7} />
            </button>
          </div>

          {/* Progress bar */}
          <ProgressBar total={5} current={1} />

          {/* Title */}
          <div className="py-2 text-center">
            <h1
              className="font-chewy"
              style={{ fontSize: 32, color: '#272724', lineHeight: 1.2 }}
            >
              Hagamos un check-in rápido, Sofia
            </h1>
          </div>
        </div>
      </div>

      {/* Emotion grid */}
      <div className="flex-1 overflow-y-auto scroll-hide px-5 pb-8">
        <p
          className="font-quicksand font-bold text-center opacity-70 mb-10 mt-4"
          style={{ fontSize: 18, color: '#272724' }}
        >
          Toca la emoción que mejor te represente.
        </p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {emotions.map(({ key, label, img, nextScreen }) => (
            <button
              key={key}
              onClick={() => onNavigate(nextScreen)}
              className="flex flex-col items-center gap-5 card-press"
            >
              <div className="animate-float-blob flex items-center justify-center" style={{ height: 130 }}>
                <img
                  src={img}
                  alt={label}
                  style={{ width: 120, height: 120, objectFit: 'contain' }}
                />
              </div>
              <span
                className="font-quicksand"
                style={{ fontSize: 16, color: '#272724' }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
