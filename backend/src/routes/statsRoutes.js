import { Router } from 'express'
import { getDashboardStats } from '../controllers/statsController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = Router()

// ruta protegida para el panel de administrador
router.get('/dashboard', protect, getDashboardStats)

export default router