import { Router } from 'express'
import { getProperties, getPropertyById, getAdminProperties, createProperty, updateProperty, updatePropertyStatus, deleteProperty } from '../controllers/propertyController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validatorMiddleware.js'
import { propertyValidator } from '../utils/validators.js'

const router = Router()

// rutas publicas
router.get('/', getProperties)
router.get('/:id', getPropertyById)

// rutas protegidas (admin con jwt)
router.get('/admin/all', protect, getAdminProperties)
router.post('/', protect, propertyValidator, validateRequest, createProperty)
router.put('/:id', protect, propertyValidator, validateRequest, updateProperty)
router.patch('/:id/status', protect, updatePropertyStatus)
router.delete('/:id', protect, deleteProperty)

export default router