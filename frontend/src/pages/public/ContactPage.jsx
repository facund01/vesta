import { useState, useEffect } from 'react'
import { getCompanyInfoRequest, sendInquiryRequest } from '../../api/endpoints'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react'
import Swal from 'sweetalert2'

export const ContactPage = () => {
  const [company, setCompany] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: 'Consulta general desde web',
    mensaje: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompanyInfoRequest()
        setCompany(res.data?.data)
      } catch (error) {
        console.error('Error al cargar datos institucionales:', error)
      }
    }
    fetchCompany()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await sendInquiryRequest(formData)
      Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        text: 'Nos pondremos en contacto a la brevedad.',
        confirmButtonColor: '#2563eb'
      })
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: 'Consulta general desde web',
        mensaje: ''
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: error.response?.data?.message || 'Ocurrió un error al procesar tu solicitud.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-responsive">
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
          Contactanos
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Estamos para asesorarte en la búsqueda o comercialización de tu propiedad. Escribinos o visitá nuestra oficina.
        </p>
      </div>

      <div className="detail-layout">
        {/* Canales de Atención e Información Institucional */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>
              Nuestras Oficinas
            </h2>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#2563eb', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.95rem' }}>Dirección</strong>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {company?.direccion || 'Av. Corrientes 1500, Balvanera, CABA'}
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#2563eb', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.95rem' }}>Teléfono Central</strong>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {company?.telefono || '+54 11 4888-9999'}
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#2563eb', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.95rem' }}>Email Corporativo</strong>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {company?.email || 'contacto@vesta.com'}
                  </span>
                </div>
              </li>

              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ background: '#eff6ff', padding: '0.6rem', borderRadius: '8px', color: '#2563eb', flexShrink: 0 }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.95rem' }}>Horarios</strong>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {company?.horariosAtencion || 'Lunes a Viernes de 9:00 a 19:00 hs'}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Formulario de Mensaje */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <MessageSquare size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              Envianos un mensaje
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Nombre y Apellido *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Tu nombre completo"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Email de contacto *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tuemail@ejemplo.com"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+54 11 1234-5678"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Mensaje *
              </label>
              <textarea
                name="mensaje"
                rows={4}
                value={formData.mensaje}
                onChange={handleChange}
                required
                placeholder="¿En qué podemos ayudarte?"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.8rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'background 0.2s'
              }}
            >
              {submitting ? 'Enviando...' : (
                <>
                  <Send size={16} /> Enviar Mensaje
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}