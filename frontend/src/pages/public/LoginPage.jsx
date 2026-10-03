import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2'

export const LoginPage = () => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Sesión iniciada correctamente',
        timer: 1500,
        showConfirmButton: false
      })
      navigate('/admin/dashboard')
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: error.response?.data?.message || 'Credenciales inválidas'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Acceso Administrativo</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{ width: '100%', padding: '0.75rem', background: '#2563eb', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}
        >
          {submitting ? 'Verificando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  )
}