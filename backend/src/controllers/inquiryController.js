import Inquiry from '../models/Inquiry.js'
import Property from '../models/Property.js'
import CompanyInfo from '../models/CompanyInfo.js'
import { sendEmail } from '../utils/sendEmail.js'

// @desc    enviar una consulta desde el sitio publico
// @route   POST /api/v1/inquiries
// @access  publico
export const createInquiry = async (req, res, next) => {
  try {
    const { nombre, email, telefono, asunto, mensaje, propiedad } = req.body

    let propertyData = null
    if (propiedad) {
      propertyData = await Property.findById(propiedad)
      if (!propertyData) {
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

    // enviar notificacion por email al admin
    try {
      const company = await CompanyInfo.findOne()
      const adminEmail = company?.email || process.env.FROM_EMAIL

      const emailHtml = `
        <h2>Nueva consulta recibida en Vesta Propiedades</h2>
        <p><strong>Remitente:</strong> ${nombre} (${email} - Tel: ${telefono || 'No especificado'})</p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        ${propertyData ? `<p><strong>Propiedad:</strong> ${propertyData.titulo} (${propertyData.direccion})</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #333;">${mensaje}</blockquote>
      `

      await sendEmail({
        email: adminEmail,
        subject: `Nueva Consulta Web: ${asunto}`,
        message: `Nueva consulta de ${nombre} (${email}): ${mensaje}`,
        html: emailHtml
      })
    } catch (mailError) {
      console.error('No se pudo enviar el correo de aviso:', mailError.message)
    }

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