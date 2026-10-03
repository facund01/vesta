import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export const PublicLayout = () => {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      {/* flex: 1 obliga al main a expandirse y empujar el footer hacia abajo */}
      <main style={{ 
        flex: '1 0 auto', 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%'
      }}>
        <div key={location.pathname} className="page-transition" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>
      <Footer style={{ flexShrink: 0 }}/>
    </div>
  )
}