import Property from '../models/Property.js'
import Inquiry from '../models/Inquiry.js'
import Category from '../models/Category.js'

// @desc    obtener metricas consolidadas para el dashboard
// @route   GET /api/v1/stats/dashboard
// @access  privado (jwt)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProperties,
      activeProperties,
      totalInquiries,
      pendingInquiries,
      totalCategories,
      propertiesByType,
      propertiesByStatus
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ activa: true }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ estado: 'Pendiente' }),
      Category.countDocuments(),
      // agrupacion por tipo de operacion (venta / alquiler)
      Property.aggregate([
        { $group: { _id: '$tipoOperacion', count: { $sum: 1 } } }
      ]),
      // agrupacion por estado de disponibilidad
      Property.aggregate([
        { $group: { _id: '$estado', count: { $sum: 1 } } }
      ])
    ])

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProperties,
          activeProperties,
          inactiveProperties: totalProperties - activeProperties,
          totalInquiries,
          pendingInquiries,
          totalCategories
        },
        propertiesByType,
        propertiesByStatus
      }
    })
  } catch (error) {
    next(error)
  }
}