import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPropertiesRequest, getCategoriesRequest } from '../../api/endpoints'
import { PropertyCard } from '../../components/PropertyCard'
import { Filter, RotateCcw, Search, Building } from 'lucide-react'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [properties, setProperties] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtros locales
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [categoria, setCategoria] = useState(searchParams.get('categoria') || '')
  const [tipoOperacion, setTipoOperacion] = useState(searchParams.get('tipoOperacion') || '')
  const [moneda, setMoneda] = useState(searchParams.get('moneda') || '')
  const [minPrecio, setMinPrecio] = useState(searchParams.get('minPrecio') || '')
  const [maxPrecio, setMaxPrecio] = useState(searchParams.get('maxPrecio') || '')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategoriesRequest()
        setCategories(res.data?.data || [])
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        const params = {
          search: searchParams.get('search') || undefined,
          categoria: searchParams.get('categoria') || undefined,
          tipoOperacion: searchParams.get('tipoOperacion') || undefined,
          moneda: searchParams.get('moneda') || undefined,
          minPrecio: searchParams.get('minPrecio') || undefined,
          maxPrecio: searchParams.get('maxPrecio') || undefined
        }

        const res = await getPropertiesRequest(params)
        setProperties(res.data?.data || [])
      } catch (error) {
        console.error('Error al consultar propiedades:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchParams])

  const handleApplyFilters = (e) => {
    e.preventDefault()
    const newParams = {}
    if (search.trim()) newParams.search = search.trim()
    if (categoria) newParams.categoria = categoria
    if (tipoOperacion) newParams.tipoOperacion = tipoOperacion
    if (moneda) newParams.moneda = moneda
    if (minPrecio) newParams.minPrecio = minPrecio
    if (maxPrecio) newParams.maxPrecio = maxPrecio

    setSearchParams(newParams)
  }

  const handleResetFilters = () => {
    setSearch('')
    setCategoria('')
    setTipoOperacion('')
    setMoneda('')
    setMinPrecio('')
    setMaxPrecio('')
    setSearchParams({})
  }

  return (
    <div className="container-responsive">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e293b' }}>
          Catálogo de Inmuebles
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Explorá todas las propiedades disponibles en Vesta Propiedades.
        </p>
      </div>

      {/* Layout adaptable: filtros + catálogo */}
      <div className="catalog-layout">
        
        {/* Panel lateral de filtros */}
        <aside style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#1e293b', fontSize: '1.05rem' }}>
              <Filter size={18} color="#2563eb" /> Filtros
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              title="Limpiar filtros"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'transparent',
                color: '#64748b',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <RotateCcw size={14} /> Limpiar
            </button>
          </div>

          <form onSubmit={handleApplyFilters} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Palabra clave o dirección
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Ej: Corrientes, Terraza..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem 0.65rem 2.2rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Tipo de Propiedad
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="custom-select"
                style={{ padding: '0.65rem 2rem 0.65rem 0.75rem', fontSize: '0.9rem' }}
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Tipo de Operación
              </label>
              <select
                value={tipoOperacion}
                onChange={(e) => setTipoOperacion(e.target.value)}
                className="custom-select"
                style={{ padding: '0.65rem 2rem 0.65rem 0.75rem', fontSize: '0.9rem' }}
              >
                <option value="">Todas las operaciones</option>
                <option value="Venta">Venta</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Alquiler Temporal">Alquiler Temporal</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Moneda
              </label>
              <select
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                className="custom-select"
                style={{ padding: '0.65rem 2rem 0.65rem 0.75rem', fontSize: '0.9rem' }}
              >
                <option value="">Cualquier moneda</option>
                <option value="USD">USD (Dólares)</option>
                <option value="ARS">ARS (Pesos)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Rango de Precio
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={minPrecio}
                  onChange={(e) => setMinPrecio(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '0.65rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  placeholder="Máximo"
                  value={maxPrecio}
                  onChange={(e) => setMaxPrecio(e.target.value)}
                  style={{
                    width: '50%',
                    padding: '0.65rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginTop: '0.5rem'
              }}
            >
              Aplicar Filtros
            </button>
          </form>
        </aside>

        {/* Listado de resultados */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Mostrando <strong>{properties.length}</strong> {properties.length === 1 ? 'propiedad' : 'propiedades'}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner mensaje="Consultando disponibilidad..." />
          ) : properties.length === 0 ? (
            <div style={{
              backgroundColor: '#ffffff',
              padding: '3.5rem 1.5rem',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <Building size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#1e293b', marginBottom: '0.5rem' }}>
                No encontramos publicaciones con esos criterios
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Intentá ampliando el rango de precio o buscando en otra categoría.
              </p>
              <button
                onClick={handleResetFilters}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#334155',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Restablecer búsqueda
              </button>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}