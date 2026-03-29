import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  onAuthSuccess: () => void
}

export default function RegisterScreen({ onNavigate, onAuthSuccess }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleRegister() {
    if (!name || !email || !password) { setError('Rellena todos los campos'); return }
    if (!terms) { setError('Acepta los términos y condiciones'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setSent(true)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  if (sent) return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10" style={{ background: '#FFFFFF' }}>
      <div className="flex flex-col items-center mb-8">
        <span className="font-chewy" style={{ fontSize: 48, color: '#9CADFF', lineHeight: 1 }}>Mooood</span>
        <svg viewBox="0 0 80 22" width="80" height="22" style={{ marginTop: 2 }}>
          <path d="M10,4 Q40,24 70,4" stroke="#9CADFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <div className="text-center mb-8">
        <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>
        <h2 className="font-chewy mb-2" style={{ fontSize: 24, color: '#272724' }}>Revisa tu email</h2>
        <p className="font-quicksand" style={{ fontSize: 14, color: '#9B9789', lineHeight: 1.6 }}>
          Te hemos enviado un enlace de confirmación a<br />
          <span style={{ color: '#272724', fontWeight: 600 }}>{email}</span>.<br /><br />
          Confirma tu cuenta y luego inicia sesión.
        </p>
      </div>
      <button
        onClick={() => onNavigate('login')}
        className="w-full font-quicksand font-bold"
        style={{ background: '#272724', color: '#FFFEFA', borderRadius: 30, padding: '15px', fontSize: 16 }}
      >
        Ir a iniciar sesión
      </button>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10" style={{ background: '#FFFFFF' }}>
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <span className="font-chewy" style={{ fontSize: 48, color: '#9CADFF', lineHeight: 1 }}>Mooood</span>
        <svg viewBox="0 0 80 22" width="80" height="22" style={{ marginTop: 2 }}>
          <path d="M10,4 Q40,24 70,4" stroke="#9CADFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="font-chewy text-center mb-1" style={{ fontSize: 26, color: '#272724' }}>Crear una cuenta</h1>
      <p className="font-quicksand text-center mb-6" style={{ fontSize: 14, color: '#9B9789' }}>Bienvenido a Mooood</p>

      {/* Fields */}
      <div className="w-full flex flex-col gap-3 mb-3">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full font-quicksand text-center outline-none"
          style={{ background: '#F0F0F0', borderRadius: 30, padding: '13px 20px', fontSize: 14, color: '#272724' }}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full font-quicksand text-center outline-none"
          style={{ background: '#F0F0F0', borderRadius: 30, padding: '13px 20px', fontSize: 14, color: '#272724' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full font-quicksand text-center outline-none"
          style={{ background: '#F0F0F0', borderRadius: 30, padding: '13px 20px', fontSize: 14, color: '#272724' }}
        />
      </div>

      {/* Terms */}
      <label className="w-full flex items-center gap-2 mb-5 cursor-pointer">
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="w-4 h-4 flex-shrink-0" />
        <span className="font-quicksand" style={{ fontSize: 12, color: '#272724' }}>
          Acepto los{' '}
          <span style={{ color: '#9CADFF' }}>términos y condiciones de uso</span>
        </span>
      </label>

      {/* Error */}
      {error && <p className="font-quicksand text-center mb-3" style={{ fontSize: 12, color: '#F0A580' }}>{error}</p>}

      {/* Register button */}
      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full font-quicksand font-bold mb-4"
        style={{ background: '#272724', color: '#FFFEFA', borderRadius: 30, padding: '15px', fontSize: 16, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Cargando...' : 'Registrarme'}
      </button>

      {/* Divider */}
      <p className="font-quicksand mb-3" style={{ fontSize: 12, color: '#9B9789' }}>O crear cuenta con</p>

      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 mb-3 font-quicksand font-semibold"
        style={{ background: '#F5F5F5', borderRadius: 30, padding: '13px', fontSize: 14, color: '#272724', border: '1px solid #E0E0E0' }}
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.9 32.5 29.4 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-5z"/>
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 13 24 13c2.8 0 5.3 1 7.2 2.7l5.7-5.7C33.5 7.1 29 5 24 5c-7.7 0-14.3 4.4-17.7 9.7z"/>
          <path fill="#4CAF50" d="M24 45c4.9 0 9.4-1.8 12.8-4.8l-6-5.2C29 36.6 26.6 37.5 24 37.5c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.6 40.5 16.3 45 24 45z"/>
          <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6 5.2C40.6 35.3 44 30.6 44 25c0-1.7-.1-3.3-.4-5z"/>
        </svg>
        Continuar con Google
      </button>

      {/* Apple */}
      <button
        className="w-full flex items-center justify-center gap-3 mb-6 font-quicksand font-bold"
        style={{ background: '#272724', color: '#FFFEFA', borderRadius: 30, padding: '13px', fontSize: 14 }}
      >
        <svg width="18" height="20" viewBox="0 0 814 1000" fill="white">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-167.7-113.3C66 392.8 17.3 212.7 17.3 141.7c0-4.9.2-9.7.5-14.5C19.1 96.5 44.9 50 84.8 27.4c30.4-16.9 63.8-24.9 99.1-24.9 62.4 0 111.4 29.1 150.4 69.4C374.6 116.8 419 69.1 479.7 37.5c-43.7 95.4-44 225.3 0 319.8 49.9-55.9 109.1-100.6 185.2-111.2C701 233.4 758.4 308.5 788.1 340.9z"/>
        </svg>
        Continuar con Apple
      </button>

      {/* Login link */}
      <p className="font-quicksand" style={{ fontSize: 13, color: '#272724' }}>
        ¿Ya tienes cuenta?{' '}
        <button onClick={() => onNavigate('login')} className="font-quicksand font-semibold" style={{ color: '#9CADFF' }}>
          Iniciar sesión
        </button>
      </p>
    </div>
  )
}
