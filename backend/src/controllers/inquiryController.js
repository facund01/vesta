import Inquiry from '../models/Inquiry.js'
import Property from '../models/Property.js'

// @desc    enviar una consulta desde el sitio publico
// @route   POST /api/v1/inquiries
// @access  publico
export const createInquiry = async (req, res, next) => {
  try {
    const { nombre, email, telefono, asunto, mensaje, propiedad } = req.body

    // si viene asociada a una propiedad, validar que exista
    if (propiedad) {
      const propertyExists = await Property.findById(propiedad)
      if (!propertyExists) {
        return res.status(400).json({
          success: false,
          message: 'La propiedad por la que consulta no existe'
        })
      }
    }

    const inquiry = await Inquiry.create({
      nombre,
      email,
      telefono,
      asunto,
      mensaje,
      propiedad: propiedad || null
    })

    res.status(201).json({
      success: true,
      data: inquiry,
      message: 'Consulta enviada correctamente'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    obtener todas las consultas con filtro por estado
// @route   GET /api/v1/inquiries
// @access  privado (jwt)
export const getInquiries = async (req, res, next) => {
  try {
    const { estado } = req.query
    const query = {}

    if (estado) {
      query.estado = estado
    }

    const inquiries = await Inquiry.find(query)
      .populate('propiedad', 'titulo direccion precio moneda')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    })
  } catch (error) {
    next(error)
  }
}

// @desc    obtener una consulta por id
// @route   GET /api/v1/inquiries/:id
// @access  privado (jwt)
export const getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate(
      'propiedad',
      'titulo direccion precio moneda imagenes'
    )

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      })
    }

    res.status(200).json({
      success: true,
      data: inquiry
    })
  } catch (error) {
    next(error)
  }
}

// @desc    actualizar estado de una consulta (pendiente / leida / respondida)
// @route   PATCH /api/v1/inquiries/:id/status
// @access  privado (jwt)
export const updateInquiryStatus = async (req, res, next) => {
  try {
    const { estado } = req.body

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { estado } },
      { new: true, runValidators: true }
    )

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      })
    }

    res.status(200).json({
      success: true,
      data: inquiry,
      message: 'Estado de la consulta actualizado'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    eliminar una consulta
// @route   DELETE /api/v1/inquiries/:id
// @access  privado (jwt)
export const deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Consulta no encontrada'
      })
    }

    await inquiry.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Consulta eliminada correctamente'
    })
  } catch (error) {
    next(error)
  }
}