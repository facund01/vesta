import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  // Mientras verifica el token almacenado en localStorage, mostramos un estado de espera
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Cargando sesión...</p>
      </div>
    )
  }

  // Si no está autenticado, redirigimos a la pantalla de Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, permitimos el paso al componente o ruta anidada
  return <Outlet />
}