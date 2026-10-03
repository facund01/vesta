import { useEffect, useState } from 'react'
import { getDashboardStatsRequest } from '../../api/endpoints'
import { Building2, MessageSquare, Tags, Star, CheckCircle, TrendingUp } from 'lucide-react'

export const DashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStatsRequest()
        setStats(res.data?.data || null)
      } catch (error) {
        console.error('Error al cargar métricas del dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        Calculando estadísticas del inventario...
      </div>
    )
  }

  // Mapeo exacto según la respuesta de tu backend
  const summary = stats?.summary || {}
  const totalProps = summary.totalProperties ?? 0
  const activeProps = summary.activeProperties ?? 0
  const pendingInquiries = summary.pendingInquiries ?? 0
  const totalInquiries = summary.totalInquiries ?? 0
  const totalCats = summary.totalCategories ?? 0

  const propertiesByType = stats?.propertiesByType || []
  const propertiesByStatus = stats?.propertiesByStatus || []

  return (
    <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Encabezado */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>
          Métricas y Rendimiento
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Resumen consolidado del inventario, prospectos y clasificaciones de Vesta Propiedades.
        </p>
      </div>

      {/* TARJETAS KPI SUPERIORES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Inmuebles */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Propiedades</span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#1e293b', marginTop: '0.2rem' }}>
              {totalProps}
            </strong>
          </div>
          <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.75rem', borderRadius: '10px' }}>
            <Building2 size={24} />
          </div>
        </div>

        {/* Propiedades Activas */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Propiedades Activas</span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#059669', marginTop: '0.2rem' }}>
              {activeProps}
            </strong>
          </div>
          <div style={{ background: '#ecfdf5', color: '#059669', padding: '0.75rem', borderRadius: '10px' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Consultas Pendientes */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Consultas Pendientes</span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#dc2626', marginTop: '0.2rem' }}>
              {pendingInquiries}
            </strong>
          </div>
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '10px' }}>
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Categorías Activas */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Categorías</span>
            <strong style={{ display: 'block', fontSize: '1.85rem', color: '#1e293b', marginTop: '0.2rem' }}>
              {totalCats}
            </strong>
          </div>
          <div style={{ background: '#f1f5f9', color: '#475569', padding: '0.75rem', borderRadius: '10px' }}>
            <Tags size={24} />
          </div>
        </div>
      </div>

      {/* BLOQUES DESCRIPTIVOS DE DISTRIBUCIÓN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Distribución por Operación (Venta / Alquiler / Temporal) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#2563eb" /> Distribución por Operación
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {propertiesByType.length > 0 ? (
              propertiesByType.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>{item._id}</span>
                  <span style={{
                    backgroundColor: item._id === 'Venta' ? '#eff6ff' : '#ecfdf5',
                    color: item._id === 'Venta' ? '#2563eb' : '#059669',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '20px'
                  }}>
                    {item.count} {item.count === 1 ? 'unidad' : 'unidades'}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Sin datos disponibles.</p>
            )}
          </div>
        </div>

        {/* Resumen de Consultas */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={18} color="#059669" /> Estado de Consultas
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 600 }}>Total Recibidas</span>
              <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{totalInquiries}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.9rem', color: '#dc2626', fontWeight: 600 }}>Pendientes de Atención</span>
              <strong style={{ fontSize: '1rem', color: '#dc2626' }}>{pendingInquiries}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.9rem', color: '#059669', fontWeight: 600 }}>Atendidas / Gestionadas</span>
              <strong style={{ fontSize: '1rem', color: '#059669' }}>
                {Math.max(0, totalInquiries - pendingInquiries)}
              </strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}