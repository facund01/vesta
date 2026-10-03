import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getInquiriesRequest,
  updateInquiryStatusRequest,
  deleteInquiryRequest
} from '../../api/endpoints'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  ExternalLink, 
  Trash2
} from 'lucide-react'
import Swal from 'sweetalert2'

export const AdminInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('todas') // 'todas', 'pendientes', 'atendidas'

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const res = await getInquiriesRequest()
      setInquiries(res.data?.data || [])
    } catch (error) {
      console.error('Error al cargar consultas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  // Comprueba si ya fue leída o respondida contemplando con o sin tilde
  const checkIsAtendida = (inquiry) => {
    const estado = (inquiry.estado || '').trim()
    return estado === 'Leída' || estado === 'Leida' || estado === 'Respondida'
  }

  // Normalizador para el valor del select visual (siempre muestra 'Leída')
  const getDisplayStatus = (estado) => {
    if (estado === 'Leida' || estado === 'Leída') return 'Leída'
    if (estado === 'Respondida') return 'Respondida'
    return 'Pendiente'
  }

  // Actualizar estado cumpliendo la validación
  const handleUpdateStatus = async (inquiryId, nuevoEstado) => {
    try {
      // Pasamos el string directo porque updateInquiryStatusRequest ya arma { estado: status }
      await updateInquiryStatusRequest(inquiryId, nuevoEstado)

      setInquiries((prev) =>
        prev.map((item) =>
          item._id === inquiryId
            ? { ...item, estado: nuevoEstado }
            : item
        )
      )

      Swal.fire({
        icon: 'success',
        title: `Estado: ${nuevoEstado}`,
        timer: 1200,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error al actualizar estado:', error.response?.data)
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'No se pudo actualizar el estado'
      })
    }
  }

  // Eliminar consulta
  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: '¿Eliminar consulta?',
      text: `Se borrará el mensaje enviado por ${nombre || 'el usuario'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteInquiryRequest(id)
          setInquiries((prev) => prev.filter((i) => i._id !== id))
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'La consulta fue borrada con éxito',
            timer: 1200,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            text: error.response?.data?.message || error.response?.data?.msg || 'No se pudo eliminar la consulta'
          })
        }
      }
    })
  }

  // Filtrado
  const filteredInquiries = inquiries.filter((item) => {
    const isAtendida = checkIsAtendida(item)
    if (filterStatus === 'pendientes') return !isAtendida
    if (filterStatus === 'atendidas') return isAtendida
    return true
  })

  // Estilos visuales
  const getStatusBadgeStyle = (estado) => {
    if (estado === 'Respondida') {
      return {
        bg: '#ecfdf5',
        color: '#059669',
        border: '#a7f3d0',
        cardBorder: '#10b981'
      }
    }
    if (estado === 'Leída' || estado === 'Leida') {
      return {
        bg: '#f0f9ff',
        color: '#0284c7',
        border: '#bae6fd',
        cardBorder: '#0ea5e9'
      }
    }
    return {
      bg: '#fff7ed',
      color: '#ea580c',
      border: '#fed7aa',
      cardBorder: '#f97316'
    }
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Cabecera */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>
            Bandeja de Consultas
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Mensajes de clientes interesados recibidos desde la web o fichas de propiedades.
          </p>
        </div>

        {/* Filtros por pestaña */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          {[
            { label: 'Todas', val: 'todas' },
            { label: 'Pendientes', val: 'pendientes' },
            { label: 'Atendidas / Leídas', val: 'atendidas' }
          ].map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => setFilterStatus(tab.val)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: filterStatus === tab.val ? '#ffffff' : 'transparent',
                color: filterStatus === tab.val ? '#1e293b' : '#64748b',
                boxShadow: filterStatus === tab.val ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de mensajes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          Cargando bandeja de consultas...
        </div>
      ) : filteredInquiries.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <MessageSquare size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem' }}>
            No hay consultas en este filtro
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            {filterStatus === 'pendientes'
              ? 'No tenés consultas pendientes.'
              : 'No se encontraron registros bajo este criterio.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredInquiries.map((inquiry) => {
            const displayStatus = getDisplayStatus(inquiry.estado)
            const badgeStyle = getStatusBadgeStyle(displayStatus)

            return (
              <div
                key={inquiry._id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${badgeStyle.cardBorder}`,
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Cabecera de la consulta: Remitente y Selector */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.2rem' }}>
                      {inquiry.nombre}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={15} color="#2563eb" /> {inquiry.email}
                      </span>
                      {inquiry.telefono && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={15} color="#059669" /> {inquiry.telefono}
                        </span>
                      )}
                      {inquiry.createdAt && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={15} color="#94a3b8" />
                          {new Date(inquiry.createdAt).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} hs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selector de Estado con "Leída" y Botón Eliminar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ position: 'relative' }}>
                      <select
                        value={displayStatus}
                        onChange={(e) => handleUpdateStatus(inquiry._id, e.target.value)}
                        style={{
                          padding: '0.45rem 2rem 0.45rem 0.85rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          outline: 'none',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          border: `1px solid ${badgeStyle.border}`,
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.color,
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 8px center',
                          backgroundSize: '12px'
                        }}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Leída">Leída</option>
                        <option value="Respondida">Respondida</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(inquiry._id, inquiry.nombre)}
                      title="Eliminar mensaje"
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Si la consulta está atada a un inmueble */}
                {inquiry.propiedad && (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: '#475569' }}>
                      Inmueble consultado: <strong>{inquiry.propiedad.titulo || 'Propiedad de referencia'}</strong>
                    </span>
                    <Link
                      to={`/propiedades/${inquiry.propiedad._id || inquiry.propiedad}`}
                      target="_blank"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: '#2563eb',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Ver publicación <ExternalLink size={14} />
                    </Link>
                  </div>
                )}

                {/* Mensaje */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#334155',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line'
                }}>
                  {inquiry.asunto && (
                    <strong style={{ display: 'block', color: '#1e293b', marginBottom: '0.3rem' }}>
                      Asunto: {inquiry.asunto}
                    </strong>
                  )}
                  {inquiry.mensaje}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}