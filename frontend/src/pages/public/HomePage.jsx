import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategoriesRequest, getPropertiesRequest } from '../../api/endpoints'
import { PropertyCard } from '../../components/PropertyCard'
import { Search, Building } from 'lucide-react'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export const HomePage = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Estados del Buscador central
  const [search, setSearch] = useState('')
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, propsRes] = await Promise.all([
          getCategoriesRequest(),
          getPropertiesRequest({ limit: 6, destacada: true })
        ])
        setCategories(catsRes.data?.data || [])
        
        if (propsRes.data?.data?.length > 0) {
          setFeaturedProperties(propsRes.data.data)
        } else {
          const fallbackRes = await getPropertiesRequest({ limit: 6 })
          setFeaturedProperties(fallbackRes.data?.data || [])
        }
      } catch (error) {
        console.error('Error al cargar datos de inicio:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const queryParams = new URLSearchParams()
    if (search.trim()) queryParams.append('search', search.trim())
    if (categoria) queryParams.append('categoria', categoria)

    navigate(`/propiedades?${queryParams.toString()}`)
  }

  return (
    <div>
      {/* --- HERO SECTION --- */}
      <section className="hero-section" style={{
        position: 'relative',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        {/* Título Principal */}
        <h1 className="hero-title" style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '0.8rem',
          letterSpacing: '-0.5px',
          maxWidth: '800px'
        }}>
          Encontrá tu próxima propiedad
        </h1>
        <p className="hero-subtitle" style={{
          fontSize: '1.15rem',
          color: '#cbd5e1',
          marginBottom: '2.5rem',
          maxWidth: '600px'
        }}>
          Departamentos, casas y locales con el respaldo de Vesta Propiedades.
        </p>

        {/* Barra de Búsqueda Flotante Directa */}
        <div style={{ width: '100%', maxWidth: '850px' }}>
          <form
            className="hero-search-form"
            onSubmit={handleSearch}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '0.85rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              alignItems: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Input de Ubicación o Término */}
            <div style={{ flex: '2 1 260px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Buscar por ubicación, calle o barrio (Ej: Almagro, Medrano)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.6rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  color: '#1e293b',
                  outline: 'none'
                }}
              />
              <Search
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>

            {/* Selector Desplegable de Tipo de Propiedad */}
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <Building
                size={18}
                color="#94a3b8"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="custom-select"
              >
                <option value="">Tipo de Propiedad (Todos)</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón Buscar */}
            <button
              type="submit"
              style={{
                flex: '0 0 auto',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.85rem 1.8rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background 0.2s'
              }}
            >
              <Search size={18} />
              Buscar
            </button>
          </form>
        </div>
      </section>

      {/* --- SECCIÓN DE PROPIEDADES DESTACADAS --- */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Oportunidades Seleccionadas
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1e293b', marginTop: '0.2rem' }}>
              Propiedades Destacadas
            </h2>
          </div>
          <button
            onClick={() => navigate('/propiedades')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'transparent',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.95rem',
              padding: '0.5rem 0'
            }}
          >
            Ver todo el catálogo →
          </button>
        </div>

        {/* Grid o Estado de Carga */}
        {loading ? (
          <LoadingSpinner mensaje="Cargando propiedades destacadas..." />
        ) : featuredProperties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', backgroundColor: '#fff', borderRadius: '8px' }}>
            No hay propiedades destacadas en este momento.
          </div>
        ) : (
          <div className="properties-grid">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}