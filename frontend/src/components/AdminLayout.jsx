import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Tags, 
  MessageSquare, 
  Settings,
  ExternalLink, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Cierra el sidebar en móvil cuando se hace clic en un enlace
  const handleNavClick = () => {
    setSidebarOpen(false)
  }

  const navItemStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 600,
    textDecoration: 'none',
    color: isActive ? '#ffffff' : '#94a3b8',
    backgroundColor: isActive ? '#2563eb' : 'transparent',
    transition: 'all 0.2s ease'
  })

  return (
    <div className="admin-layout-container">
      {/* BARRA SUPERIOR PARA MÓVILES */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: '#2563eb', padding: '0.35rem', borderRadius: '6px' }}>
            <Building2 size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800 }}>Vesta</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: 'transparent', color: '#fff', padding: '0.4rem' }}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* BACKDROP (Toca fuera para cerrar) */}
      <div 
        className={`admin-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR ADMINISTRATIVO */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Cabecera Sidebar */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '6px' }}>
              <Building2 size={20} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>VESTA</span>
              <span style={{ fontSize: '0.7rem', display: 'block', color: '#38bdf8', fontWeight: 600 }}>
                PANEL DE GESTIÓN
              </span>
            </div>
          </div>
          {/* Botón cerrar visible solo en móvil cuando está abierto */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'transparent', color: '#94a3b8', display: sidebarOpen ? 'block' : 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Enlaces de Navegación */}
        <nav style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <NavLink to="/admin/dashboard" style={navItemStyle} onClick={handleNavClick} end>
            <LayoutDashboard size={18} />
            <span>Métricas</span>
          </NavLink>

          <NavLink to="/admin/propiedades" style={navItemStyle} onClick={handleNavClick}>
            <Building2 size={18} />
            <span>Propiedades</span>
          </NavLink>

          <NavLink to="/admin/categorias" style={navItemStyle} onClick={handleNavClick}>
            <Tags size={18} />
            <span>Categorías</span>
          </NavLink>

          <NavLink to="/admin/consultas" style={navItemStyle} onClick={handleNavClick}>
            <MessageSquare size={18} />
            <span>Consultas</span>
          </NavLink>

          <NavLink to="/admin/configuracion" style={navItemStyle} onClick={handleNavClick}>
            <Settings size={18} />
            <span>Configuración</span>
          </NavLink>

          <div style={{ margin: '1rem 0', borderTop: '1px solid #1e293b' }} />

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#64748b',
              textDecoration: 'none'
            }}
          >
            <ExternalLink size={18} />
            <span>Ver sitio público</span>
          </Link>
        </nav>

        {/* Perfil del Operador y Cierre de Sesión */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', backgroundColor: '#090d16' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{
                background: '#1e293b',
                color: '#38bdf8',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={18} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', display: 'block', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {user?.nombre || 'Administrador'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                  Agente Activo
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{
                backgroundColor: 'transparent',
                color: '#ef4444',
                padding: '0.4rem',
                borderRadius: '6px'
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DINÁMICO CON ANIMACIÓN */}
      <main className="admin-main-content">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}