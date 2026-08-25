import { Router } from 'express'
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validatorMiddleware.js'
import { categoryValidator } from '../utils/validators.js'

const router = Router()

// rutas publicas
router.get('/', getCategories)
router.get('/:id', getCategoryById)

// rutas protegidas (requieren token jwt)
router.post('/', protect, categoryValidator, validateRequest, createCategory)
router.put('/:id', protect, categoryValidator, validateRequest, updateCategory)
router.delete('/:id', protect, deleteCategory)

export default router