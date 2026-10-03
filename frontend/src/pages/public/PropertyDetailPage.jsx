import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPropertyByIdRequest, sendInquiryRequest } from '../../api/endpoints'
import { MapPin, Maximize2, BedDouble, ArrowLeft, Send } from 'lucide-react'
import Swal from 'sweetalert2'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export const PropertyDetailPage = () => {
  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await getPropertyByIdRequest(id)
        const data = res.data?.data
        setProperty(data)
        if (data?.imagenes?.length > 0) {
          setSelectedImage(data.imagenes[0])
        }
        setFormData((prev) => ({
          ...prev,
          asunto: `Consulta por: ${data?.titulo || 'Inmueble'}`
        }))
      } catch (error) {
        console.error('Error al cargar la propiedad:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitInquiry = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await sendInquiryRequest({
        ...formData,
        propiedad: id
      })

      Swal.fire({
        icon: 'success',
        title: '¡Consulta enviada!',
        text: 'Un asesor de Vesta Propiedades se comunicará con vos a la brevedad.',
        confirmColor: '#2563eb'
      })

      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: `Consulta por: ${property?.titulo || 'Inmueble'}`,
        mensaje: ''
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: error.response?.data?.message || 'No se pudo enviar la consulta. Intentá nuevamente.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner mensaje="Cargando detalles de la propiedad..." />
  }

  if (!property) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Propiedad no encontrada</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          La publicación que buscás no existe o fue dada de baja.
        </p>
        <Link
          to="/propiedades"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="container-responsive">
      <Link
        to="/propiedades"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#64748b',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} /> Volver a las propiedades
      </Link>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: property.tipoOperacion === 'Venta' ? '#2563eb' : '#059669',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '6px',
            textTransform: 'uppercase'
          }}>
            {property.tipoOperacion}
          </span>
          {property.categoria?.nombre && (
            <span style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '6px'
            }}>
              {property.categoria.nombre}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem' }}>
          {property.titulo}
        </h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '1rem' }}>
          <MapPin size={18} color="#94a3b8" /> {property.direccion}
        </p>
      </div>

      {/* Layout adaptable: Galería/Detalles (Izquierda) + Formulario (Derecha) */}
      <div className="detail-layout">
        
        <div>
          {/* Imagen principal con altura adaptada en CSS */}
          <div className="detail-main-img" style={{
            width: '100%',
            height: '420px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            marginBottom: '1rem'
          }}>
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
              alt={property.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Miniaturas */}
          {property.imagenes && property.imagenes.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
              {property.imagenes.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '90px',
                    height: '65px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImage === img ? '2px solid #2563eb' : '2px solid transparent',
                    padding: 0,
                    flexShrink: 0,
                    cursor: 'pointer'
                  }}
                >
                  <img src={img} alt={`Vista ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Caja de métricas responsive */}
          <div className="detail-metrics-box" style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Precio</span>
              <strong style={{ fontSize: '1.4rem', color: '#1e293b' }}>
                {property.moneda === 'USD' ? 'USD ' : '$ '}
                {property.precio?.toLocaleString('es-AR')}
              </strong>
            </div>

            {property.ambientes && (
              <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Ambientes</span>
                <strong style={{ fontSize: '1.25rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <BedDouble size={18} color="#64748b" /> {property.ambientes}
                </strong>
              </div>
            )}

            {property.superficieM2 && (
              <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Superficie</span>
                <strong style={{ fontSize: '1.25rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Maximize2 size={18} color="#64748b" /> {property.superficieM2} m²
                </strong>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
              Descripción de la propiedad
            </h2>
            <p style={{ color: '#475569', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {property.descripcion}
            </p>
          </div>
        </div>

        {/* Formulario lateral adaptable */}
        <div className="detail-sticky-form" style={{ position: 'sticky', top: '90px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.3rem' }}>
              Consultar por este inmueble
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Dejanos tus datos y un asesor se pondrá en contacto.
            </p>

            <form onSubmit={handleSubmitInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                  placeholder="Hola, me interesa conocer más detalles o coordinar una visita..."
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
                    <Send size={16} /> Enviar Consulta
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}