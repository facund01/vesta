import { Router } from 'express'
import { createInquiry, getInquiries, getInquiryById, updateInquiryStatus, deleteInquiry } from '../controllers/inquiryController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validatorMiddleware.js'
import { inquiryValidator, updateInquiryStatusValidator } from '../utils/validators.js'

const router = Router()

// ruta publica (formulario de contacto)
router.post('/', inquiryValidator, validateRequest, createInquiry)

// rutas protegidas (bandeja de entrada admin)
router.get('/', protect, getInquiries)
router.get('/:id', protect, getInquiryById)
router.patch('/:id/status', protect, updateInquiryStatusValidator, validateRequest, updateInquiryStatus)
router.delete('/:id', protect, deleteInquiry)

export default router