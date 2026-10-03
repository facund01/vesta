export const LoadingSpinner = ({ mensaje = 'Buscando inmuebles...' }) => {
  return (
    <div className="loading-container fade-in">
      <div className="spinner-loader" />
      {mensaje && (
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
          {mensaje}
        </p>
      )}
    </div>
  )
}