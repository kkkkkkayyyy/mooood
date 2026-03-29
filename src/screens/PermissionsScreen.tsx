import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  onAccept: () => void
  onSkip: () => void
}

export default function PermissionsScreen({ onAccept, onSkip }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-between px-7 pt-20 pb-10" style={{ background: '#FFFEFA' }}>
      <div className="flex flex-col items-center gap-6 flex-1 justify-center">
        {/* Title */}
        <h1 className="font-chewy text-center" style={{ fontSize: 30, color: '#272724' }}>
          Antes de empezar
        </h1>

        <p className="font-quicksand text-center" style={{ fontSize: 15, color: '#656359', lineHeight: 1.6 }}>
          Para poder acompañarte cuando lo necesites, necesitamos algunos permisos.
        </p>

        <div style={{ height: 1, background: '#EFEFEF', width: '100%' }} />

        <div className="flex flex-col gap-4">
          <p className="font-quicksand text-center" style={{ fontSize: 14, color: '#656359', lineHeight: 1.65 }}>
            Usamos las señales de tu wearable (como el ritmo del corazón o el movimiento) para notar momentos de ansiedad.
          </p>

          <p className="font-quicksand font-bold text-center" style={{ fontSize: 16, color: '#272724', lineHeight: 1.4 }}>
            Puede ser tu reloj, anillo u otro dispositivo.
          </p>

          <p className="font-quicksand text-center" style={{ fontSize: 13, color: '#9B9789', lineHeight: 1.6 }}>
            Si decides no activar algo, algunas funciones pueden no estar disponibles.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col items-center gap-4 mt-8">
        <button
          onClick={onAccept}
          className="w-full font-quicksand font-bold py-4 rounded-full"
          style={{ background: '#272724', color: '#FFFEFA', fontSize: 16 }}
        >
          Aceptar
        </button>
        <button
          onClick={onSkip}
          className="font-quicksand font-medium"
          style={{ fontSize: 15, color: '#272724', textDecoration: 'underline' }}
        >
          Ahora no
        </button>
        <p className="font-quicksand text-center" style={{ fontSize: 12, color: '#9B9789' }}>
          Puedes cambiar esto cuando quieras.
        </p>
      </div>
    </div>
  )
}
