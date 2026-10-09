import { Link, useNavigate } from 'react-router-dom'
import { Building2, User, LogOut, LayoutDashboard, Home, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div className="navbar-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Logotipo e Identidad */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img 
            src="/logo-header.png" 
            alt="Vesta Propiedades Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
          />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            VESTA <span style={{ color: '#2563eb', fontSize: '0.85rem', fontWeight: 600 }}>PROPIEDADES</span>
          </span>
        </Link>

        {/* Enlaces de Navegación Pública (Sin botón buscar propiedades) */}
        <nav className="navbar-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#334155'
          }}>
            <Home size={17} /> Inicio
          </Link>
          <Link to="/contacto" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#334155'
          }}>
            <Mail size={17} /> Contacto
          </Link>
        </nav>

        {/* Acciones de Sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/admin/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '0.5rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <LayoutDashboard size={16} /> Panel Admin
              </Link>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-ripple" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              <User size={16} /> Acceso Agente
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}