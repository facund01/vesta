import { Router } from 'express'
import { register, login, getProfile, updateProfile } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validatorMiddleware.js'
import { registerValidator, loginValidator, updateProfileValidator } from '../utils/validators.js'

const router = Router()

router.post('/register', registerValidator, validateRequest, register)
router.post('/login', loginValidator, validateRequest, login)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfileValidator, validateRequest, updateProfile)

export default router