import { useState, useEffect } from 'react'
import { getCompanyInfoRequest, updateCompanyInfoRequest } from '../../api/endpoints'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Save, 
  Mail
} from 'lucide-react'
import Swal from 'sweetalert2'

export const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [companyInfo, setCompanyInfo] = useState({
    nombreComercio: 'Vesta Propiedades',
    descripcion: '',
    direccion: '',
    telefono: '',
    emailContacto: '',
    horariosAtencion: 'Lunes a Viernes de 9:00 a 18:00 hs',
    redesSociales: {
      instagram: '',
      facebook: '',
      linkedin: '',
      whatsapp: ''
    }
  })

  // Cargar información al montar el componente
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await getCompanyInfoRequest()
        if (res.data?.data || res.data) {
          setCompanyInfo((prev) => ({
            ...prev,
            ...(res.data?.data || res.data)
          }))
        }
      } catch (error) {
        console.error('Error al cargar la información institucional:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyInfo()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('redesSociales.')) {
      const red = name.split('.')[1]
      setCompanyInfo((prev) => ({
        ...prev,
        redesSociales: {
          ...prev.redesSociales,
          [red]: value
        }
      }))
    } else {
      setCompanyInfo((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateCompanyInfoRequest(companyInfo)
      Swal.fire({
        icon: 'success',
        title: 'Información actualizada',
        text: 'Los datos institucionales del comercio fueron guardados correctamente.',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error al guardar datos institucionales:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.message || 'No se pudieron guardar los cambios.'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        Cargando datos institucionales...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>
          Información del Comercio
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Gestioná la información pública de Vesta Propiedades que se muestra en el portal web, pie de página y datos de contacto.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Bloque 1: Información General */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="#2563eb" /> Información General
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Nombre del Comercio / Inmobiliaria
              </label>
              <input
                type="text"
                name="nombreComercio"
                value={companyInfo.nombreComercio || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Descripción o Eslogan Institucional
              </label>
              <textarea
                name="descripcion"
                rows="3"
                value={companyInfo.descripcion || ''}
                onChange={handleChange}
                placeholder="Breve reseña sobre la trayectoria y servicios..."
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: Ubicación y Atención */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="#2563eb" /> Ubicación y Datos de Contacto
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Dirección Física
              </label>
              <input
                type="text"
                name="direccion"
                value={companyInfo.direccion || ''}
                onChange={handleChange}
                placeholder="Ej: Av. Corrientes 1234, CABA"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Teléfono de Contacto
              </label>
              <input
                type="text"
                name="telefono"
                value={companyInfo.telefono || ''}
                onChange={handleChange}
                placeholder="+54 11 1234-5678"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Correo Electrónico de Contacto
              </label>
              <input
                type="email"
                name="emailContacto"
                value={companyInfo.emailContacto || ''}
                onChange={handleChange}
                placeholder="contacto@vestapropiedades.com"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Horarios de Atención
              </label>
              <input
                type="text"
                name="horariosAtencion"
                value={companyInfo.horariosAtencion || ''}
                onChange={handleChange}
                placeholder="Lunes a Viernes de 9:00 a 18:00 hs"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* Bloque 3: Redes Sociales */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="#2563eb" /> Redes Sociales y Canales Digitales
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Instagram
              </label>
              <input
                type="text"
                name="redesSociales.instagram"
                value={companyInfo.redesSociales?.instagram || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/vestapropiedades"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Facebook
              </label>
              <input
                type="text"
                name="redesSociales.facebook"
                value={companyInfo.redesSociales?.facebook || ''}
                onChange={handleChange}
                placeholder="https://facebook.com/vestapropiedades"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                WhatsApp Directo
              </label>
              <input
                type="text"
                name="redesSociales.whatsapp"
                value={companyInfo.redesSociales?.whatsapp || ''}
                onChange={handleChange}
                placeholder="5491112345678"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                LinkedIn
              </label>
              <input
                type="text"
                name="redesSociales.linkedin"
                value={companyInfo.redesSociales?.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/vestapropiedades"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-ripple"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.8rem 2rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Save size={18} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}