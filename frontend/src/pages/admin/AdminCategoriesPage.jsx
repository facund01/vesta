import { useState, useEffect } from 'react'
import {
  getCategoriesRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest
} from '../../api/endpoints'
import { Plus, Edit, Trash2, Tags, X } from 'lucide-react'
import Swal from 'sweetalert2'

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Control modal de edición / creación
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await getCategoriesRequest()
      setCategories(res.data?.data || [])
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({ nombre: '', descripcion: '' })
    setModalOpen(true)
  }

  const handleOpenEdit = (category) => {
    setEditingId(category._id)
    setFormData({
      nombre: category.nombre || '',
      descripcion: category.descripcion || ''
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingId) {
        await updateCategoryRequest(editingId, formData)
        Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          timer: 1500,
          showConfirmButton: false
        })
      } else {
        await createCategoryRequest(formData)
        Swal.fire({
          icon: 'success',
          title: 'Categoría creada con éxito',
          timer: 1500,
          showConfirmButton: false
        })
      }
      setModalOpen(false)
      fetchCategories()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar la categoría'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: `Se eliminará "${nombre}". Las propiedades asociadas podrían requerir reclasificación.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategoryRequest(id)
          setCategories((prev) => prev.filter((c) => c._id !== id))
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'La categoría fue eliminada con éxito',
            timer: 1500,
            showConfirmButton: false
          })
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            text: error.response?.data?.message || 'No se pudo eliminar la categoría'
          })
        }
      }
    })
  }

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
            Tipos de Propiedad (Categorías)
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Gestioná las clasificaciones disponibles para los inmuebles del portal.
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
          <Plus size={18} /> Nueva Categoría
        </button>
      </div>

      {/* Listado */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          Cargando clasificaciones...
        </div>
      ) : categories.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '3rem 1rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <Tags size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.5rem' }}>
            No hay categorías cargadas
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Hacé clic en "Nueva Categoría" para dar de alta la primera clasificación.
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
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Nombre</th>
                <th style={{ padding: '1rem' }}>Descripción</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#1e293b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '6px' }}>
                        <Tags size={16} />
                      </div>
                      <span>{cat.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', maxWidth: '350px' }}>
                    {cat.descripcion || 'Sin descripción'}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        title="Editar categoría"
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          padding: '0.45rem',
                          borderRadius: '6px'
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.nombre)}
                        title="Eliminar categoría"
                        style={{
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          padding: '0.45rem',
                          borderRadius: '6px'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
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
            maxWidth: '480px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b' }}>
                {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ backgroundColor: 'transparent', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Departamentos, Casas, Terrenos..."
                  style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Breve reseña sobre el tipo de inmueble..."
                  style={{ width: '100%', padding: '0.65rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
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
                  {submitting ? 'Guardando...' : (editingId ? 'Guardar Cambios' : 'Crear Categoría')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}