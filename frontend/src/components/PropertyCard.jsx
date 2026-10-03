import { Link } from 'react-router-dom'
import { MapPin, Maximize2, BedDouble } from 'lucide-react'

export const PropertyCard = ({ property }) => {
  const {
    _id,
    titulo,
    direccion,
    precio,
    moneda,
    tipoOperacion,
    categoria,
    imagenes,
    superficieM2,
    ambientes,
    destacada
  } = property

  // Imagen por defecto si no tiene
  const imagenPortada = imagenes && imagenes.length > 0
    ? imagenes[0]
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="property-card" style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Contenedor de Imagen y Badges */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
        <img
          src={imagenPortada}
          alt={titulo}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Badge Tipo Operación */}
        <span style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: tipoOperacion === 'Venta' ? '#2563eb' : '#059669',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 10px',
          borderRadius: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {tipoOperacion}
        </span>

        {/* Badge Destacada */}
        {destacada && (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '6px',
            textTransform: 'uppercase'
          }}>
            Destacada
          </span>
        )}

        {/* Categoría sobre la foto */}
        {categoria?.nombre && (
          <span style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#ffffff',
            fontSize: '0.75rem',
            padding: '3px 8px',
            borderRadius: '4px'
          }}>
            {categoria.nombre}
          </span>
        )}
      </div>

      {/* Cuerpo de la tarjeta */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#1e293b'
          }}>
            {moneda === 'USD' ? 'USD ' : '$ '}
            {precio?.toLocaleString('es-AR')}
          </span>
        </div>

        <h3 style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1e293b',
          marginBottom: '0.5rem',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {titulo}
        </h3>

        <p style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          color: '#64748b',
          marginBottom: '1rem'
        }}>
          <MapPin size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {direccion}
          </span>
        </p>

        {/* Métricas: Ambientes y Superficie */}
        <div style={{
          display: 'flex',
          gap: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9',
          marginTop: 'auto',
          fontSize: '0.85rem',
          color: '#475569'
        }}>
          {ambientes && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BedDouble size={16} color="#64748b" />
              <span>{ambientes} amb.</span>
            </div>
          )}
          {superficieM2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Maximize2 size={16} color="#64748b" />
              <span>{superficieM2} m²</span>
            </div>
          )}
        </div>

        {/* Botón Ver Detalle */}
        <Link
          to={`/propiedades/${_id}`}
          className="btn-ripple"
          style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            color: '#2563eb',
            border: '1px solid #e2e8f0',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.6rem',
            borderRadius: '6px',
            marginTop: '1rem',
            transition: 'background 0.2s'
          }}
        >
          Ver Inmueble
        </Link>
      </div>
    </div>
  )
}