import { useState, useEffect } from 'react'
import {
  getAdminPropertiesRequest,
  getCategoriesRequest,
  createPropertyRequest,
  updatePropertyRequest,
  updatePropertyStatusRequest,
  deletePropertyRequest
} from '../../api/endpoints'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  X, 
  CheckCircle2, 
  Building2,
  DollarSign
} from 'lucide-react'
import Swal from 'sweetalert2'

export const AdminPropertiesPage = () => {
  const [properties, setProperties] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Control de Modal de Creación / Edición
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Estado del Formulario
  const initialForm = {
    titulo: '',
    descripcion: '',
    tipoOperacion: 'Venta',
    categoria: '',
    precio: '',
    moneda: 'USD',
    direccion: '',
    ambientes: '',
    superficieM2: '',
    destacada: false,
    imagenesText: '' // Entrada de URLs separadas por comas o saltos de línea
  }
  const [formData, setFormData] = useState(initialForm)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [propsRes, catsRes] = await Promise.all([
        getAdminPropertiesRequest(),
        getCategoriesRequest()
      ])
      setProperties(propsRes.data?.data || [])
      setCategories(catsRes.data?.data || [])
    } catch (error) {
      console.error('Error al cargar datos de inventario:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Abrir modal para nueva publicación
  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      ...initialForm,
      categoria: categories[0]?._id || ''
    })
    setModalOpen(true)
  }

  // Abrir modal para editar
  const handleOpenEdit = (prop) => {
    setEditingId(prop._id)
    setFormData({
      titulo: prop.titulo || '',
      descripcion: prop.descripcion || '',
      tipoOperacion: prop.tipoOperacion || 'Venta',
      categoria: prop.categoria?._id || prop.categoria || '',
      precio: prop.precio || '',
      moneda: prop.moneda || 'USD',
      direccion: prop.direccion || '',
      ambientes: prop.ambientes || '',
      superficieM2: prop.superficieM2 || '',
      destacada: prop.destacada || false,
      imagenesText: prop.imagenes ? prop.imagenes.join('\n') : ''
    })
    setModalOpen(true)
  }

  // Guardar (Crear o Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Formatear imágenes desde el textarea a un array limpio
    const imagenes = formData.imagenesText
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    const payload = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      tipoOperacion: formData.tipoOperacion,
      categoria: formData.categoria,
      precio: Number(formData.precio),
      moneda: formData.moneda,
      direccion: formData.direccion,
      ambientes: formData.ambientes ? Number(formData.ambientes) : undefined,
      superficieM2: formData.superficieM2 ? Number(formData.superficieM2) : undefined,
      destacada: formData.destacada,
      imagenes: imagenes.length > 0 ? imagenes : undefined
    }

    try {
      if (editingId) {
        await updatePropertyRequest(editingId, payload)
        Swal.fire({
          icon: 'success',
          title: 'Propiedad actualizada',
          timer: 1500,
          showConfirmButton: false
        })
      } else {
        await createPropertyRequest(payload)
        Swal.fire({
          icon: 'success',
          title: 'Propiedad creada con éxito',
          timer: 1500,
          showConfirmButton: false
        })
      }
      setModalOpen(false)
      fetchData()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar',
        text: error.response?.data?.message || 'Revisá los datos ingresados'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Alternar Estado Activo / Pausado
  const handleToggleStatus = async (prop) => {
    // Detectamos si el backend usa 'activo', 'activa' o 'disponible'
    const estadoActual = prop.activo !== undefined ? prop.activo : (prop.activa !== undefined ? prop.activa : true)
    const nuevoEstado = !estadoActual

    try {
      // Enviamos tanto 'activo' como 'activa' para compatibilidad total con el controlador
      await updatePropertyStatusRequest(prop._id, { activo: nuevoEstado, activa: nuevoEstado })
      
      setProperties((prev) =>
        prev.map((item) => (item._id === prop._id ? { ...item, activo: nuevoEstado, activa: nuevoEstado } : item))
      )
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado de la publicación'
      })
    }
  }

  // Eliminar Propiedad
  const handleDelete = (id, titulo) => {
    Swal.fire({
      title: '¿Confirmar eliminación?',
      text: `Se dará de baja "${titulo}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePropertyRequest(id)
          setProperties((prev) => prev.filter((p) => p._id !== id))
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'La publicación fue eliminada del sistema',
            timer: 1500,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'No se pudo eliminar el inmueble'
          })
        }
      }
    })
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Cabecera de la sección */}
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
            Gestión de Inmuebles
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Administrá publicaciones, precios, estados y visibilidad en el portal.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus size={18} /> Nueva Propiedad
        </button>
      </div>

      {/* Listado / Tabla Responsiva */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          Cargando inventario de propiedades...
        </div>
      ) : properties.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '3rem 1rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <Building2 size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem' }}>
            No hay propiedades registradas
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Hacé clic en "Nueva Propiedad" para cargar tu primera publicación.
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Inmueble</th>
                <th style={{ padding: '1rem' }}>Operación / Tipo</th>
                <th style={{ padding: '1rem' }}>Precio</th>
                <th style={{ padding: '1rem' }}>Estado</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                  {/* Foto + Título */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={prop.imagenes?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80'}
                        alt={prop.titulo}
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ display: 'block', color: '#1e293b', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prop.titulo}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{prop.direccion}</span>
                      </div>
                    </div>
                  </td>

                  {/* Operación y Categoría */}
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      backgroundColor: prop.tipoOperacion === 'Venta' ? '#eff6ff' : '#ecfdf5',
                      color: prop.tipoOperacion === 'Venta' ? '#2563eb' : '#059669',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '3px'
                    }}>
                      {prop.tipoOperacion}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {prop.categoria?.nombre || 'Sin categoría'}
                    </div>
                  </td>

                  {/* Precio */}
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b' }}>
                    {prop.moneda === 'USD' ? 'USD ' : '$ '}
                    {prop.precio?.toLocaleString('es-AR')}
                  </td>

                  {/* Estado Activo / Destacada */}
                  <td style={{ padding: '1rem' }}>
                    {(() => {
                      const isActiva = prop.activo !== undefined ? prop.activo : (prop.activa !== undefined ? prop.activa : true)
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: isActiva ? '#059669' : '#dc2626'
                          }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isActiva ? '#059669' : '#dc2626' }} />
                            {isActiva ? 'Activa' : 'Pausada'}
                          </span>
                          {prop.destacada && (
                            <Star size={15} color="#d97706" fill="#d97706" title="Destacada en portada" />
                          )}
                        </div>
                      )
                    })()}
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    {(() => {
                      const isActiva = prop.activo !== undefined ? prop.activo : (prop.activa !== undefined ? prop.activa : true)
                      return (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleToggleStatus(prop)}
                            title={isActiva ? 'Pausar publicación' : 'Activar publicación'}
                            style={{
                              backgroundColor: isActiva ? '#f8fafc' : '#eff6ff',
                              color: isActiva ? '#64748b' : '#2563eb',
                              border: '1px solid #e2e8f0',
                              padding: '0.45rem',
                              borderRadius: '6px'
                            }}
                          >
                            {isActiva ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(prop)}
                            title="Editar publicación"
                            style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.45rem', borderRadius: '6px' }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(prop._id, prop.titulo)}
                            title="Eliminar publicación"
                            style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.45rem', borderRadius: '6px' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE CREACIÓN / EDICIÓN */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 200
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Cabecera Modal */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                {editingId ? 'Editar Propiedad' : 'Nueva Publicación'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: 'transparent', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Título de la Publicación *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Semipiso 3 Ambientes con Balcón Aterrazado"
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Tipo de Operación *
                  </label>
                  <select
                    value={formData.tipoOperacion}
                    onChange={(e) => setFormData({ ...formData, tipoOperacion: e.target.value })}
                    className="custom-select"
                    style={{ padding: '0.65rem 2rem 0.65rem 0.75rem', fontSize: '0.9rem' }}
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                    <option value="Alquiler Temporal">Alquiler Temporal</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Categoría *
                  </label>
                  <select
                    required
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="custom-select"
                    style={{ padding: '0.65rem 2rem 0.65rem 0.75rem', fontSize: '0.9rem' }}
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Moneda *
                  </label>
                  <select
                    value={formData.moneda}
                    onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                    className="custom-select"
                    style={{ padding: '0.65rem 1.8rem 0.65rem 0.75rem', fontSize: '0.9rem' }}
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Precio *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="Ej: 145000"
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Dirección y Barrio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ej: Av. Medrano 400, Almagro, CABA"
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Ambientes
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.ambientes}
                    onChange={(e) => setFormData({ ...formData, ambientes: e.target.value })}
                    placeholder="Ej: 3"
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                    Superficie Total (m²)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.superficieM2}
                    onChange={(e) => setFormData({ ...formData, superficieM2: e.target.value })}
                    placeholder="Ej: 75"
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Descripción detallada *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Detalles sobre ambientes, luminosidad, cocina, expensas..."
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  URLs de Fotos (Una por renglón)
                </label>
                <textarea
                  rows={3}
                  value={formData.imagenesText}
                  onChange={(e) => setFormData({ ...formData, imagenesText: e.target.value })}
                  placeholder="https://images.unsplash.com/...\nhttps://images.unsplash.com/..."
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="destacada"
                  checked={formData.destacada}
                  onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="destacada" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', cursor: 'pointer' }}>
                  Mostrar como Propiedad Destacada en la portada principal
                </label>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  {submitting ? 'Guardando...' : (editingId ? 'Guardar Cambios' : 'Publicar Inmueble')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}