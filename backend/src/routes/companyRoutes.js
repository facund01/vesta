import { Router } from 'express'
import { getCompanyInfo, updateCompanyInfo } from '../controllers/companyController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validatorMiddleware.js'
import { companyValidator } from '../utils/validators.js'

const router = Router()

// ruta publica (home / footer)
router.get('/', getCompanyInfo)

// ruta protegida (admin)
router.put('/', protect, companyValidator, validateRequest, updateCompanyInfo)

export default router