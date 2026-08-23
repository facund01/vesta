// middleware para rutas no encontradas (404)
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada - ${req.originalUrl}`,
  })
}

// middleware centralizado de captura de errores (500)
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message || 'Error interno del servidor'

  // error de cast de mongoose (ej: id de mongodb invalido)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Recurso no encontrado (ID inválido)'
  }

  // error de duplicado en mongoose (ej: email ya registrado)
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message = `El valor ingresado para el campo '${field}' ya existe`
  }

  // errores de validacion propios de mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}