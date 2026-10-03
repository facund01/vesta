import { useEffect, useState } from 'react'
import { getCompanyInfoRequest } from '../api/endpoints'
import { Building2, MapPin, Phone, Mail, Clock } from 'lucide-react'

export const Footer = () => {
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await getCompanyInfoRequest()
        if (res.data?.data) {
          setCompany(res.data.data)
        }
      } catch (error) {
        console.error('Error al cargar información institucional:', error)
      }
    }

    fetchCompanyData()
  }, [])

  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      padding: '3rem 1.5rem 1.5rem 1.5rem',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem'
      }}>
        {/* Columna 1: Identidad Corporativa */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ffffff' }}>
            <Building2 size={24} color="#3b82f6" />
            <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{company?.nombreComercio || 'Vest Propiedades'}</span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#94a3b8' }}>
            {company?.descripcion || 'Comercialización y gestión integral de propiedades exclusivas en Buenos Aires con transparencia y asesoramiento profesional.'}
          </p>
        </div>

        {/* Columna 2: Canales de Atención */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Contacto y Oficina</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <MapPin size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{company?.direccion || 'Av. Corrientes 1500, Balvanera, CABA'}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Phone size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
              <span>{company?.telefono || '+54 11 4888-9999'}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={18} color="#3b82f6" style={{ flexShrink: 0 }} />
              <span>{company?.email || 'contacto@vesta.com'}</span>
            </li>
          </ul>
        </div>

        {/* Columna 3: Horarios y Redes */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Horarios de Atención</h4>
          <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{company?.horariosAtencion || 'Lunes a Viernes de 9:00 a 19:00 hs'}</span>
          </p>

          <h5 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.6rem' }}>Seguinos en redes</h5>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {company?.redesSociales?.instagram && (
              <a href={company.redesSociales.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" style={{ color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            )}
            {company?.redesSociales?.facebook && (
              <a href={company.redesSociales.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" style={{ color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            )}
            {company?.redesSociales?.whatsapp && (
              <a href={`https://wa.me/${company.redesSociales.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" style={{ color: '#94a3b8' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1e293b',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        © {new Date().getFullYear()} Vesta Propiedades. Todos los derechos reservados.
      </div>
    </footer>
  )
}