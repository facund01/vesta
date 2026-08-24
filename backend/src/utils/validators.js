import { body } from 'express-validator'

export const registerValidator = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').trim().notEmpty().withMessage('El apellido es obligatorio'),
  body('email').isEmail().withMessage('Ingrese un email válido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono').trim().notEmpty().withMessage('El teléfono es obligatorio'),
]

export const loginValidator = [
  body('email').isEmail().withMessage('Ingrese un email válido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
]

export const updateProfileValidator = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('apellido').optional().trim().notEmpty().withMessage('El apellido no puede estar vacío'),
  body('telefono').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
]