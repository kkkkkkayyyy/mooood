import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Screen } from '../App'

interface Props {
  onNavigate: (screen: Screen) => void
  onAuthSuccess: () => void
}

export default function LoginScreen({ onNavigate, onAuthSuccess }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleForgotPassword() {
    if (!email) { setError('Introduce tu correo electrónico'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setResetSent(true)
  }

  async function handleLogin() {
    if (!email || !password) { setError('Rellena todos los campos'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (err) { setError(err.message); return }
    onAuthSuccess()
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  if (forgotMode) return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto scroll-hide px-6 py-10" style={{ background: '#FFFFFF' }}>
      <div className="flex flex-col items-center mb-8">
        <span className="font-chewy" style={{ fontSize: 48, color: '#9CADFF', lineHeight: 1 }}>Mooood</span>
        <svg viewBox="0 0 80 22" width="80" height="22" style={{ marginTop: 2 }}>
          <path d="M10,4 Q40,24 70,4" stroke="#9CADFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      {resetSent ? (
        <div className="text-center mb-8">
          <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>
          <h2 className="font-chewy mb-2" style={{ fontSize: 24, color: '#272724' }}>Revisa tu email</h2>
          <p className="font-quicksand" style={{ fontSize: 14, color: '#9B9789', lineHeight: 1.6 }}>
            Te hemos enviado un enlace para restablecer tu contraseña a<br />
            <span style={{ color: '#272724', fontWeight: 600 }}>{email}</span>.
          </p>
        </div>
      ) : (
        <>
          <h1 className="font-chewy text-center mb-1" style={{ fontSize: 26, color: '#272724' }}>Recuperar contraseña</h1>
          <p className="font-quicksand text-center mb-6" style={{ fontSize: 14, color: '#9B9789' }}>Te enviaremos un enlace por email</p>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full font-quicksand text-center outline-none mb-5"
            style={{ background: '#F0F0F0', borderRadius: 30, padding: '13px 20px', fontSize: 14, color: '#272724' }}
          />
          {error && <p className="font-quicksand text-center mb-3" style={{ fontSize: 12, color: '#F0A580' }}>{error}</p>}
          <button
            onClick={handleForgotPassword}
            disabled={loading}
            className="w-full font-quicksand font-bold mb-4"
            style={{ background: '#272724', color: '#FFFEFA', borderRadius: 30, padding: '15px', fontSize: 16, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </>
      )}
      <button onClick={() => { setForgotMode(false); setResetSent(false); setError('') }} className="font-quicksand" style={{ fontSize: 13, color: '#9CADFF' }}>
        ← Volver a iniciar sesión
      </button>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col items-center overflow-y-auto scroll-hide px-6 py-10" style={{ background: '#FFFFFF' }}>
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <span className="font-chewy" style={{ fontSize: 48, color: '#9CADFF', lineHeight: 1 }}>Mooood</span>
        <svg viewBox="0 0 80 22" width="80" height="22" style={{ marginTop: 2 }}>
          <path d="M10,4 Q40,24 70,4" stroke="#9CADFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="font-chewy text-center mb-1" style={{ fontSize: 26, color: '#272724' }}>Iniciar sesión</h1>
      <p className="font-quicksand text-center mb-6" style={{ fontSize: 14, color: '#9B9789' }}>Bienvenido a Mooood</p>

      {/* Fields */}
      <div className="w-full flex flex-col gap-3 mb-3">
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

      {/* Remember + forgot */}
      <div className="w-full flex items-center justify-between mb-5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4" />
          <span className="font-quicksand" style={{ fontSize: 12, color: '#272724' }}>Recordarme</span>
        </label>
        <button onClick={() => setForgotMode(true)} className="font-quicksand" style={{ fontSize: 12, color: '#9CADFF' }}>
          ¿Has olvidado tu contraseña?
        </button>
      </div>

      {/* Error */}
      {error && <p className="font-quicksand text-center mb-3" style={{ fontSize: 12, color: '#F0A580' }}>{error}</p>}

      {/* Login button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full font-quicksand font-bold mb-4"
        style={{ background: '#272724', color: '#FFFEFA', borderRadius: 30, padding: '15px', fontSize: 16, opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </button>

      {/* Divider */}
      <p className="font-quicksand mb-3" style={{ fontSize: 12, color: '#9B9789' }}>O iniciar sesión con</p>

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
        <svg width="18" height="20" viewBox="0 0 842.32007 1000.0001" fill="white">
          <path d="M824.66636 779.30363c-15.12299 34.93724-33.02368 67.09674-53.7638 96.66374-28.27076 40.3074-51.4182 68.2078-69.25717 83.7012-27.65347 25.4313-57.2822 38.4556-89.00964 39.1963-22.77708 0-50.24539-6.4813-82.21973-19.629-32.07926-13.0861-61.55985-19.5673-88.51583-19.5673-28.27075 0-58.59083 6.4812-91.02193 19.5673-32.48053 13.1477-58.64639 19.9994-78.65196 20.6784-30.42501 1.29623-60.75123-12.0985-91.02193-40.2457-19.32039-16.8514-43.48632-45.7394-72.43607-86.6641-31.060778-43.7024-56.597041-94.37983-76.602609-152.15586C10.740416 658.44309 0 598.01283 0 539.50845c0-67.01648 14.481044-124.8172 43.486336-173.25401C66.28194 327.34823 96.60818 296.6578 134.5638 274.1276c37.95566-22.53016 78.96676-34.01129 123.1321-34.74585c24.16591 0 55.85633 7.47508 95.23784 22.166 39.27042 14.74029 64.48571 22.21538 75.54091 22.21538c8.26518 0 36.27668-8.7405 83.7629-26.16587 44.90607-16.16001 82.80614-22.85118 113.85458-20.21546 84.13326 6.78992 147.34122 39.95559 189.37699 99.70686-75.24463 45.59122-112.46573 109.4473-111.72502 191.36456.67899 63.8067 23.82643 116.90384 69.31888 159.06309 20.61664 19.56727 43.64066 34.69027 69.2571 45.4307-5.55531 16.11062-11.41933 31.54225-17.65372 46.35662zM631.70926 20.0057c0 50.01141-18.27108 96.70693-54.6897 139.92782-43.94932 51.38118-97.10817 81.07162-154.75459 76.38659-.73454-5.99983-1.16045-12.31444-1.16045-18.95003 0-48.01091 20.9006-99.39207 58.01678-141.40314 18.53027-21.27094 42.09746-38.95744 70.67685-53.0663C578.3158 9.00229 605.2903 1.31621 630.65988 0c.74076 6.68575 1.04938 13.37191 1.04938 20.00505z"/>
        </svg>
        Continuar con Apple
      </button>

      {/* Register link */}
      <p className="font-quicksand" style={{ fontSize: 13, color: '#272724' }}>
        ¿Todavía no tienes cuenta?{' '}
        <button onClick={() => onNavigate('register')} className="font-quicksand font-semibold" style={{ color: '#9CADFF' }}>
          Registrarse
        </button>
      </p>
    </div>
  )
}
