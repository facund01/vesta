import Property from '../models/Property.js'
import Category from '../models/Category.js'

// @desc    obtener propiedades publicas con busqueda y filtros combinados
// @route   GET /api/v1/properties
// @access  publico
export const getProperties = async (req, res, next) => {
  try {
    const {
      search,
      categoria,
      tipoOperacion,
      minPrecio,
      maxPrecio,
      destacada,
      estado,
    } = req.query

    // solo muestra inmuebles activos al publico
    const query = { activa: true }

    // busqueda por texto (titulo, direccion o descripcion)
    if (search) {
      query.$or = [
        { titulo: { $regex: search, $options: 'i' } },
        { direccion: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
      ]
    }

    // filtrar por id de categoria
    if (categoria) {
      query.categoria = categoria
    }

    // filtrar por venta / alquiler / alquiler temporal
    if (tipoOperacion) {
      query.tipoOperacion = tipoOperacion
    }

    // filtrar por estado de disponibilidad
    if (estado) {
      query.estado = estado
    }

    // filtrar destacados para el home
    if (destacada !== undefined) {
      query.destacada = destacada === 'true'
    }

    // filtro por rango de precio
    if (minPrecio || maxPrecio) {
      query.precio = {}
      if (minPrecio) query.precio.$gte = Number(minPrecio)
      if (maxPrecio) query.precio.$lte = Number(maxPrecio)
    }

    const properties = await Property.find(query)
      .populate('categoria', 'nombre slug')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    obtener detalle de una propiedad por id
// @route   GET /api/v1/properties/:id
// @access  publico
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'categoria',
      'nombre slug descripcion'
    )

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada',
      })
    }

    res.status(200).json({
      success: true,
      data: property,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    obtener todas las propiedades para el panel admin (incluye inactivas)
// @route   GET /api/v1/properties/admin/all
// @access  privado (jwt)
export const getAdminProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .populate('categoria', 'nombre slug')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    crear una nueva propiedad
// @route   POST /api/v1/properties
// @access  privado (jwt)
export const createProperty = async (req, res, next) => {
  try {
    // validar que la categoria exista
    const categoryExists = await Category.findById(req.body.categoria)
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'La categoría seleccionada no existe',
      })
    }

    const property = await Property.create(req.body)

    res.status(201).json({
      success: true,
      data: property,
      message: 'Propiedad creada exitosamente',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    actualizar una propiedad existente
// @route   PUT /api/v1/properties/:id
// @access  privado (jwt)
export const updateProperty = async (req, res, next) => {
  try {
    if (req.body.categoria) {
      const categoryExists = await Category.findById(req.body.categoria)
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'La categoría seleccionada no existe',
        })
      }
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('categoria', 'nombre slug')

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada',
      })
    }

    res.status(200).json({
      success: true,
      data: property,
      message: 'Propiedad actualizada exitosamente',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    cambio rapido de estado o activación (toggle)
// @route   PATCH /api/v1/properties/:id/status
// @access  privado (jwt)
export const updatePropertyStatus = async (req, res, next) => {
  try {
    const { activa, estado } = req.body
    const updateData = {}

    if (activa !== undefined) updateData.activa = activa
    if (estado !== undefined) updateData.estado = estado

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada',
      })
    }

    res.status(200).json({
      success: true,
      data: property,
      message: 'Estado de la propiedad actualizado',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    eliminar una propiedad
// @route   DELETE /api/v1/properties/:id
// @access  privado (jwt)
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada',
      })
    }

    await property.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Propiedad eliminada correctamente',
    })
  } catch (error) {
    next(error)
  }
}