import { useState } from 'react'
import { Trash2, RefreshCw, ExternalLink, X, Pencil, Check } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { supabase } from '../lib/supabase'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  userName?: string
  userEmail?: string
  wearableConnected?: boolean
  onConnectWearable?: () => void
  onDisconnectWearable?: () => void
}

export default function ProfileScreen({ onNavigate, userName, userEmail, wearableConnected = false, onConnectWearable, onDisconnectWearable }: Props) {
  const [notifications, setNotifications] = useState<'sensible' | 'picos' | 'siempre'>('sensible')

  const notifDescriptions = {
    sensible: 'Te avisamos solo cuando detectamos cambios relevantes en tu biometría o momentos de tensión moderada.',
    picos: 'Solo recibirás notificaciones cuando se detecte un pico de estrés o activación muy alta.',
    siempre: 'Recibirás todas las notificaciones en tiempo real, incluyendo pequeños cambios y actualizaciones de estado.',
  }
  const [modoChill, setModoChill] = useState(false)
  const [chillFrom, setChillFrom] = useState('22:00')
  const [chillTo, setChillTo] = useState('08:00')
  const [hidePrivate, setHidePrivate] = useState(false)

  // Editable fields
  const [editName, setEditName] = useState(false)
  const [editEmail, setEditEmail] = useState(false)
  const [editPassword, setEditPassword] = useState(false)
  const [name, setName] = useState(userName || '')
  const [email, setEmail] = useState(userEmail || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saveMsg, setSaveMsg] = useState('')
  const [saveError, setSaveError] = useState('')

  async function saveName() {
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (error) { setSaveError('Error al guardar el nombre'); return }
    setEditName(false)
    showSuccess('Nombre actualizado')
  }

  async function saveEmail() {
    const { error } = await supabase.auth.updateUser({ email })
    if (error) { setSaveError(error.message); return }
    setEditEmail(false)
    showSuccess('Te hemos enviado un email de confirmación')
  }

  async function savePassword() {
    if (newPassword !== confirmPassword) { setSaveError('Las contraseñas no coinciden'); return }
    if (newPassword.length < 6) { setSaveError('Mínimo 6 caracteres'); return }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) { setSaveError(error.message); return }
    setEditPassword(false)
    setNewPassword('')
    setConfirmPassword('')
    showSuccess('Contraseña actualizada')
  }

  function showSuccess(msg: string) {
    setSaveMsg(msg)
    setSaveError('')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    onNavigate('login')
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#FFFEFA' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-14 px-5 pb-4">
        <span className="font-quicksand font-semibold" style={{ fontSize: 16, color: '#9B9789' }}>Más información</span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scroll-hide px-5 pb-6">

        {/* 1. Nombre */}
        <h1 className="font-chewy mb-6" style={{ fontSize: 36, color: '#272724' }}>{name || 'Usuario'}</h1>

        {/* 2. Configuración de cuenta */}
        <p className="font-quicksand font-bold mb-4" style={{ fontSize: 16, color: '#272724' }}>Configuración de cuenta</p>

        {/* Feedback messages */}
        {saveMsg && <p className="font-quicksand text-center mb-3 px-3 py-2 rounded-xl" style={{ fontSize: 13, color: '#4CAF50', background: '#F0FFF4' }}>{saveMsg}</p>}
        {saveError && <p className="font-quicksand text-center mb-3 px-3 py-2 rounded-xl" style={{ fontSize: 13, color: '#E05C3A', background: '#FFF3F0' }}>{saveError}</p>}

        {/* Nombre */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-quicksand text-xs" style={{ color: '#9B9789' }}>Nombre</span>
            <button onClick={() => { setEditName(v => !v); setSaveError('') }}>
              <Pencil size={14} color="#9CADFF" />
            </button>
          </div>
          {editName ? (
            <div className="flex gap-2">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 font-quicksand outline-none px-3 py-2 rounded-xl"
                style={{ background: '#F0F0F0', fontSize: 14, color: '#272724' }}
              />
              <button onClick={saveName} className="flex items-center justify-center rounded-xl px-3" style={{ background: '#9CADFF' }}>
                <Check size={16} color="#272724" />
              </button>
            </div>
          ) : (
            <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>{name || '—'}</span>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-quicksand text-xs" style={{ color: '#9B9789' }}>Email</span>
            <button onClick={() => { setEditEmail(v => !v); setSaveError('') }}>
              <Pencil size={14} color="#9CADFF" />
            </button>
          </div>
          {editEmail ? (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 font-quicksand outline-none px-3 py-2 rounded-xl"
                style={{ background: '#F0F0F0', fontSize: 14, color: '#272724' }}
              />
              <button onClick={saveEmail} className="flex items-center justify-center rounded-xl px-3" style={{ background: '#9CADFF' }}>
                <Check size={16} color="#272724" />
              </button>
            </div>
          ) : (
            <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>{email || '—'}</span>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-quicksand text-xs" style={{ color: '#9B9789' }}>Contraseña</span>
            <button onClick={() => { setEditPassword(v => !v); setSaveError('') }}>
              <Pencil size={14} color="#9CADFF" />
            </button>
          </div>
          {editPassword ? (
            <div className="flex flex-col gap-2">
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="font-quicksand outline-none px-3 py-2 rounded-xl"
                style={{ background: '#F0F0F0', fontSize: 14, color: '#272724' }}
              />
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="flex-1 font-quicksand outline-none px-3 py-2 rounded-xl"
                  style={{ background: '#F0F0F0', fontSize: 14, color: '#272724' }}
                />
                <button onClick={savePassword} className="flex items-center justify-center rounded-xl px-3" style={{ background: '#9CADFF' }}>
                  <Check size={16} color="#272724" />
                </button>
              </div>
            </div>
          ) : (
            <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>••••••••</span>
          )}
        </div>

        <div style={{ height: 1, background: '#EFEFEF', marginBottom: 12 }} />

        {/* Notificaciones */}
        <p className="font-quicksand font-semibold mb-2" style={{ fontSize: 14, color: '#272724' }}>Notificaciones</p>
        <div className="flex gap-2 mb-3 flex-wrap">
          {(['sensible', 'picos', 'siempre'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setNotifications(opt)}
              className="font-quicksand font-medium px-4 py-2 rounded-full"
              style={{
                background: notifications === opt ? '#9CADFF' : 'transparent',
                border: notifications === opt ? 'none' : '1.5px solid #D0D0D0',
                color: '#272724', fontSize: 13,
              }}
            >
              {opt === 'sensible' ? 'Sensible' : opt === 'picos' ? 'Solo picos altos' : 'Siempre'}
            </button>
          ))}
        </div>
        <div className="px-3 py-2 rounded-xl mb-3" style={{ background: '#F0F3FF' }}>
          <p className="font-quicksand" style={{ fontSize: 12, color: '#656359', lineHeight: 1.5 }}>
            {notifDescriptions[notifications]}
          </p>
        </div>

        {/* Modo Chill */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setModoChill(v => !v)}
            className="relative flex-shrink-0"
            style={{ width: 48, height: 26, borderRadius: 13, background: modoChill ? '#9CADFF' : '#D0D0D0', transition: 'background 0.2s' }}
          >
            <div style={{
              position: 'absolute', top: 3,
              left: modoChill ? 25 : 3,
              width: 20, height: 20, borderRadius: '50%',
              background: '#FFFFFF', transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
          <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>Modo Chill</span>
        </div>

        {modoChill && (
          <div className="flex items-center gap-2 mb-2 px-2 py-2 rounded-xl">
            <span className="font-quicksand" style={{ fontSize: 12, color: '#9B9789', whiteSpace: 'nowrap' }}>De</span>
            <input
              type="time"
              value={chillFrom}
              onChange={e => setChillFrom(e.target.value)}
              className="font-quicksand font-medium text-center outline-none rounded-lg"
              style={{ background: '#FFFFFF', padding: '4px 6px', fontSize: 13, color: '#272724', border: '1px solid #D0D8FF', width: 80 }}
            />
            <span className="font-quicksand" style={{ fontSize: 12, color: '#9B9789' }}>a</span>
            <input
              type="time"
              value={chillTo}
              onChange={e => setChillTo(e.target.value)}
              className="font-quicksand font-medium text-center outline-none rounded-lg"
              style={{ background: '#FFFFFF', padding: '4px 6px', fontSize: 13, color: '#272724', border: '1px solid #D0D8FF', width: 80 }}
            />
          </div>
        )}

        <p className="font-quicksand mb-5" style={{ fontSize: 11, color: '#9B9789' }}>*La app no enviará notificaciones en las horas que tú decidas</p>

        <div style={{ height: 1, background: '#EFEFEF', marginBottom: 16 }} />

        {/* 3. Estado */}
        <p className="font-quicksand font-bold mb-3" style={{ fontSize: 16, color: '#272724' }}>Estado</p>

        {/* Dispositivo */}
        <p className="font-quicksand mb-2" style={{ fontSize: 13, color: '#9B9789' }}>Dispositivo</p>
        {wearableConnected ? (
          <>
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl mb-1" style={{ background: '#EEEEFF' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 16 }}>⌚</span>
                <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>Wearable conectado</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onDisconnectWearable}>
                  <Trash2 size={18} color="#E05C3A" strokeWidth={1.5} />
                </button>
                <RefreshCw size={18} color="#272724" strokeWidth={1.5} />
                <ExternalLink size={18} color="#272724" strokeWidth={1.5} />
              </div>
            </div>
            <p className="font-quicksand mb-4" style={{ fontSize: 11, color: '#9B9789' }}>*Tus datos biométricos están cifrados de extremo a extremo</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl mb-1" style={{ background: '#F0F0F0', border: '1.5px dashed #C0C0C0' }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 16 }}>⌚</span>
                <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#9B9789' }}>No conectado</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D0D0D0' }} />
              </div>
            </div>
            <p className="font-quicksand mb-2" style={{ fontSize: 11, color: '#9B9789' }}>Conecta un wearable para ver tus datos en tiempo real.</p>
            <button
              onClick={onConnectWearable}
              className="w-full font-quicksand font-semibold py-3 rounded-2xl mb-4"
              style={{ background: '#9CADFF', color: '#272724', fontSize: 14 }}
            >
              Conectar wearable
            </button>
          </>
        )}

        {/* Calendario */}
        <p className="font-quicksand mb-2" style={{ fontSize: 13, color: '#9B9789' }}>Calendario</p>
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl mb-2" style={{ background: '#EEEEFF' }}>
          <div className="flex items-center gap-2">
            <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>iCloud</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFC107' }} />
          </div>
          <div className="flex items-center gap-3">
            <Trash2 size={18} color="#272724" strokeWidth={1.5} />
            <RefreshCw size={18} color="#272724" strokeWidth={1.5} />
            <ExternalLink size={18} color="#272724" strokeWidth={1.5} />
          </div>
        </div>
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input type="checkbox" checked={hidePrivate} onChange={e => setHidePrivate(e.target.checked)} className="w-4 h-4" />
          <span className="font-quicksand" style={{ fontSize: 13, color: '#272724' }}>Ocultar eventos privados</span>
        </label>

        {/* Permiso */}
        <p className="font-quicksand mb-2" style={{ fontSize: 13, color: '#9B9789' }}>Permiso</p>
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl mb-1" style={{ background: '#EEEEFF' }}>
          <div className="flex items-center gap-2">
            <span className="font-quicksand font-medium" style={{ fontSize: 14, color: '#272724' }}>Ubicación</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
          </div>
          <div className="flex items-center gap-3">
            <Trash2 size={18} color="#272724" strokeWidth={1.5} />
            <RefreshCw size={18} color="#272724" strokeWidth={1.5} />
            <ExternalLink size={18} color="#272724" strokeWidth={1.5} />
          </div>
        </div>
        <p className="font-quicksand mb-6" style={{ fontSize: 11, color: '#9B9789' }}>*Tus datos biométricos están cifrados de extremo a extremo</p>

        <div style={{ height: 1, background: '#EFEFEF', marginBottom: 16 }} />

        {/* Cerrar / Eliminar */}
        <button
          onClick={handleSignOut}
          className="w-full font-quicksand font-semibold py-4 rounded-2xl mb-3"
          style={{ background: '#F0F3FF', color: '#272724', fontSize: 15 }}
        >Cerrar sesión</button>
        <button
          className="w-full font-quicksand font-semibold py-4 rounded-2xl"
          style={{ background: '#FFE8E0', color: '#E05C3A', fontSize: 15 }}
        >Eliminar cuenta</button>

      </div>

      {/* Bottom Nav */}
      <BottomNav onNavigate={onNavigate} onAddPress={() => onNavigate('emotion-step1')} onCalendarPress={() => onNavigate('home')} calendarActive={false} />
    </div>
  )
}
