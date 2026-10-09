import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { forgotPasswordRequest } from '../../api/endpoints'
import { LogIn, KeyRound, Mail, Lock, ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2'

export const LoginPage = () => {
  // Modos disponibles: 'login' | 'forgot'
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // -------------------------------------------------------------
      // MODO 1: INICIAR SESIÓN
      // -------------------------------------------------------------
      if (mode === 'login') {
        await login(email, password)

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Sesión iniciada correctamente',
          timer: 1500,
          showConfirmButton: false
        })

        navigate('/admin/dashboard')
      } 
      
      // -------------------------------------------------------------
      // MODO 2: RECUPERAR CONTRASEÑA
      // -------------------------------------------------------------
      else if (mode === 'forgot') {
        await forgotPasswordRequest(email)

        Swal.fire({
          icon: 'success',
          title: 'Solicitud enviada',
          text: `Si el correo ${email} está registrado, recibirás un enlace para restablecer tu contraseña.`,
          confirmButtonColor: '#2563eb'
        })

        // Volvemos al modo login
        setMode('login')
        setPassword('')
      }
    } catch (error) {
      console.error(`Error en modo ${mode}:`, error.response?.data)

      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        'Ocurrió un problema al procesar la solicitud.'

      Swal.fire({
        icon: 'error',
        title: mode === 'login' ? 'Error de autenticación' : 'Error al enviar solicitud',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Branding e Identidad */}
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/logo-header.png" 
            alt="Vesta Propiedades" 
            style={{ height: '42px', width: 'auto', marginBottom: '1rem', objectFit: 'contain' }} 
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {mode === 'login' ? 'Acceso Administrativo' : 'Recuperar Contraseña'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {mode === 'login' 
              ? 'Ingresá tus credenciales para gestionar el portal.' 
              : 'Te enviaremos un correo con las instrucciones de restauración.'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Correo Electrónico */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Correo electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="agente@vestapropiedades.com"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Contraseña (Solo se muestra en Modo Login) */}
          {mode === 'login' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Botón Principal */}
          <button
            type="submit"
            disabled={submitting}
            className="btn-ripple"
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {submitting ? (
              'Verificando...'
            ) : mode === 'login' ? (
              <> <LogIn size={18} /> Iniciar Sesión </>
            ) : (
              <> <KeyRound size={18} /> Enviar Instrucciones </>
            )}
          </button>

          {/* Botón de volver a login si está en forgot */}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '0.4rem'
              }}
            >
              <ArrowLeft size={16} /> Volver a Iniciar Sesión
            </button>
          )}
        </form>

        {/* Retorno al portal público */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
            ← Volver al sitio público
          </Link>
        </div>
      </div>
    </div>
  )
}