import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  let token

  // 1. verificar si viene el token en el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // extraer el token separando "Bearer <token>"
      token = req.headers.authorization.split(' ')[1]

      // decodificar y verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // obtener el usuario autenticado (excluyendo el password)
      req.user = await User.findById(decoded.id).select('-password')

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado o no autorizado',
        })
      }

      next() // continua hacia el controlador
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado, token no provisto',
    })
  }
}