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

export const categoryValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoría es obligatorio')
    .isLength({ min: 3 })
    .withMessage('El nombre debe tener al menos 3 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage('La descripción no puede superar los 250 caracteres'),
]

export const propertyValidator = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ min: 5 })
    .withMessage('El título debe tener al menos 5 caracteres'),
  body('direccion')
    .trim()
    .notEmpty()
    .withMessage('La dirección es obligatoria'),
  body('categoria')
    .notEmpty()
    .withMessage('La categoría es obligatoria')
    .isMongoId()
    .withMessage('El ID de categoría no es válido'),
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0'),
  body('moneda')
    .optional()
    .isIn(['USD', 'ARS'])
    .withMessage('La moneda debe ser USD o ARS'),
  body('tipoOperacion')
    .optional()
    .isIn(['Venta', 'Alquiler', 'Alquiler Temporal'])
    .withMessage('Tipo de operación inválido'),
  body('imagenes')
    .isArray({ min: 1 })
    .withMessage('Debe incluir un arreglo con al menos una URL de imagen'),
  body('estado')
    .optional()
    .isIn(['Disponible', 'Reservado', 'Alquilado', 'Vendido'])
    .withMessage('Estado de disponibilidad inválido'),
]

export const companyValidator = [
  body('nombreComercio')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del comercio no puede estar vacío'),
  body('descripcion')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La descripción no puede estar vacía'),
  body('direccion')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('La dirección no puede estar vacía'),
  body('telefono')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El teléfono no puede estar vacío'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('El email de contacto debe ser válido')
    .normalizeEmail(),
  body('horariosAtencion')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Los horarios de atención no pueden estar vacíos')
]

export const inquiryValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('email')
    .isEmail()
    .withMessage('Ingrese un correo electrónico válido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim(),
  body('asunto')
    .trim()
    .notEmpty()
    .withMessage('El asunto es obligatorio'),
  body('mensaje')
    .trim()
    .notEmpty()
    .withMessage('El mensaje es obligatorio')
    .isLength({ min: 10 })
    .withMessage('El mensaje debe tener al menos 10 caracteres'),
  body('propiedad')
    .optional({ values: 'null' })
    .isMongoId()
    .withMessage('El ID de propiedad no es válido')
]

export const updateInquiryStatusValidator = [
  body('estado')
    .trim()
    .isIn(['Pendiente', 'Leída', 'Leida', 'Respondida'])
    .withMessage('El estado debe ser Pendiente, Leída o Respondida')
]

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Ingrese un email válido').normalizeEmail()
]

export const resetPasswordValidator = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
]