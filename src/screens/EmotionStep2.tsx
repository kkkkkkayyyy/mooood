import { useState } from 'react'
import { X } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import { Screen } from '../App'

import tensionImg from '../assets/Tension.png'
import ansiedadImg from '../assets/Ansiedad.png'
import frustracionImg from '../assets/Frustracion.png'
import nerviosImg from '../assets/Nervios.png'
import angustiaImg from '../assets/Angustia.png'
import enojoImg from '../assets/Enejo.png'
import envidiaImg from '../assets/Envidia.png'
import bloqueoImg from '../assets/Bloqueo.png'
import verguenzaImg from '../assets/Verguenza.png'

interface Props { onNavigate: (screen: Screen) => void }

const subEmotions = [
  { key: 'tension',     label: 'Tension',     img: tensionImg },
  { key: 'ansiedad',    label: 'Ansiedad',    img: ansiedadImg },
  { key: 'frustracion', label: 'Frustracion', img: frustracionImg },
  { key: 'nervios',     label: 'Nervios',     img: nerviosImg },
  { key: 'angustia',    label: 'Angustia',    img: angustiaImg },
  { key: 'enojo',       label: 'Enojo',       img: enojoImg },
  { key: 'envidia',     label: 'Envidia',     img: envidiaImg },
  { key: 'bloqueo',     label: 'Bloqueo',     img: bloqueoImg },
  { key: 'verguenza',   label: 'Verguenza',   img: verguenzaImg },
]

export default function EmotionStep2({ onNavigate }: Props) {
  const [selected, setSelected] = useState('tension')

  return (
    <div className='flex-1 flex flex-col overflow-hidden' style={{ background: '#FFFEFA' }}>
      <div className='flex-shrink-0 px-5 pt-14'>
        <div className='flex items-center justify-between mb-2'>
          <button onClick={() => onNavigate('emotion-step1')} className='font-quicksand font-bold opacity-70 text-base' style={{ color: '#272724' }}>
            {'< Atras'}
          </button>
          <button onClick={() => onNavigate('home')} className='flex items-center justify-center w-12 h-12'>
            <X size={22} strokeWidth={2} color='#272724' opacity={0.7} />
          </button>
        </div>
        <ProgressBar total={5} current={2} />
        <div className='py-3 text-center'>
          <h1 className='font-chewy text-3xl' style={{ color: '#272724', lineHeight: 1.2 }}>
            Tension, entendido
          </h1>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto scroll-hide px-5 pb-4'>
        <p className='font-quicksand font-bold text-center opacity-70 mb-8' style={{ fontSize: 18, color: '#272724' }}>
          Toca la emocion que mejor te represente.
        </p>
        <div className='grid grid-cols-3 gap-x-6 gap-y-6'>
          {subEmotions.map(({ key, label, img }) => (
            <button key={key} onClick={() => setSelected(key)} className='flex flex-col items-center gap-3 card-press' style={{ opacity: selected === key ? 1 : 0.5 }}>
              <div className='flex items-center justify-center' style={{ width: 80, height: 80 }}>
                <img src={img} alt={label} style={{ width: 72, height: 72, objectFit: 'contain' }} />
              </div>
              <span className='font-quicksand text-center' style={{ fontSize: 12, color: '#272724' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='flex-shrink-0 px-5 pb-8'>
        <button onClick={() => onNavigate('body-heatmap')} className='w-full flex items-center justify-center' style={{ height: 60, background: '#272724', borderRadius: 42 }}>
          <span className='font-quicksand font-semibold' style={{ fontSize: 20, color: '#FFFEFA' }}>Continuar</span>
        </button>
      </div>
    </div>
  )
}