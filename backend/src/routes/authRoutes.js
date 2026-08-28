import { Router } from 'express'
import { register, login, getProfile, updateProfile, forgotPassword, resetPassword } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { validateRequest } from '../middlewares/validatorMiddleware.js'
import { registerValidator, loginValidator, updateProfileValidator, forgotPasswordValidator, resetPasswordValidator } from '../utils/validators.js'

const router = Router()

router.post('/register', registerValidator, validateRequest, register)
router.post('/login', loginValidator, validateRequest, login)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfileValidator, validateRequest, updateProfile)

// rutas de recuperacion
router.post('/forgot-password', forgotPasswordValidator, validateRequest, forgotPassword)
router.put('/reset-password/:token', resetPasswordValidator, validateRequest, resetPassword)

export default router