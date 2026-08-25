import Category from '../models/Category.js'
import Property from '../models/Property.js'

// @desc    obtener todas las categorias
// @route   GET /api/v1/categories
// @access  publico
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ nombre: 1 })
    res.status(200).json({
      success: true,
      data: categories,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    obtener una categoria por id
// @route   GET /api/v1/categories/:id
// @access  publico
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      })
    }

    res.status(200).json({
      success: true,
      data: category,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    crear una nueva categoria
// @route   POST /api/v1/categories
// @access  privado (jwt)
export const createCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body

    const categoryExists = await Category.findOne({
      nombre: { $regex: new RegExp(`^${nombre.trim()}$`, 'i') },
    })

    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre',
      })
    }

    const category = await Category.create({ nombre, descripcion })

    res.status(201).json({
      success: true,
      data: category,
      message: 'Categoría creada exitosamente',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    actualizar una categoria
// @route   PUT /api/v1/categories/:id
// @access  privado (jwt)
export const updateCategory = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body

    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      })
    }

    if (nombre) category.nombre = nombre
    if (descripcion !== undefined) category.descripcion = descripcion

    const updatedCategory = await category.save()

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Categoría actualizada correctamente',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    eliminar una categoria
// @route   DELETE /api/v1/categories/:id
// @access  privado (jwt)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
      })
    }

    // regla de integridad: no eliminar si tiene propiedades asignadas
    const propertiesUsingCategory = await Property.countDocuments({
      categoria: req.params.id,
    })

    if (propertiesUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${propertiesUsingCategory} publicaciones asociadas`,
      })
    }

    await category.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada correctamente',
    })
  } catch (error) {
    next(error)
  }
}
