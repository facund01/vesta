import { validationResult } from 'express-validator'

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)

  // si hay errores de validacion, responde con 400 bad request
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación en los datos enviados',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        msg: err.msg,
      })),
    })
  }

  next(); // si no hay errores, pasa al controlador
}