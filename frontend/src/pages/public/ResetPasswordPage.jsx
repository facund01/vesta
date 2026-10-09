import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { resetPasswordRequest } from '../../api/endpoints'
import { Lock, CheckCircle2, ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2'

export const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        text: 'Asegurate de escribir la misma contraseña en ambos campos.',
        confirmButtonColor: '#2563eb'
      })
    }

    if (password.length < 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 6 caracteres.',
        confirmButtonColor: '#2563eb'
      })
    }

    setLoading(true)

    try {
      await resetPasswordRequest(token, password)

      await Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu clave se modificó con éxito. Ya podés ingresar con tus nuevas credenciales.',
        confirmButtonColor: '#2563eb'
      })

      navigate('/login')
    } catch (error) {
      console.error('Error al reestablecer contraseña:', error.response?.data)
      
      const errorMsg = 
        error.response?.data?.msg || 
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg || 
        'El enlace es inválido o ha expirado. Por favor, solicitá uno nuevo.'

      Swal.fire({
        icon: 'error',
        title: 'No se pudo restablecer',
        text: errorMsg,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
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
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <img 
            src="/logo-header.png" 
            alt="Vesta Propiedades" 
            style={{ height: '42px', width: 'auto', marginBottom: '1rem', objectFit: 'contain' }} 
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Restablecer Contraseña
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Ingresá tu nueva clave para volver a acceder al panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Nueva Contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Nueva contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Confirmar Nueva Contraseña */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
              Confirmar nueva contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={loading}
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
            {loading ? (
              'Guardando...'
            ) : (
              <> <CheckCircle2 size={18} /> Actualizar Contraseña </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
          <Link to="/login" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Volver al Inicio de Sesión
          </Link>
        </div>
      </div>
    </div>
  )
}