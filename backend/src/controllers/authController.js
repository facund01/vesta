import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'

// @desc    registrar un nuevo administrador
// @route   POST /api/v1/auth/register
// @access  publico
export const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, telefono } = req.body

    // 1. verificar si el correo ya esta registrado
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario registrado con ese correo electrónico',
      })
    }

    // 2. crear el usuario (el hook pre('save') del modelo hashea la password)
    const user = await User.create({
      nombre,
      apellido,
      email,
      password,
      telefono,
    })

    // 3. responder con datos publicos y token de autenticación
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        token: generateToken(user._id),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    autenticar usuario y obtener token
// @route   POST /api/v1/auth/login
// @access  publico
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 1. buscar usuario incluyendo explicitamente el campo password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      })
    }

    // 2. comparar la contraseña provista contra el hash almacenado
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      })
    }

    // 3. responder con sesión exitosa
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        token: generateToken(user._id),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    obtener perfil del administrador autenticado
// @route   GET /api/v1/auth/profile
// @access  privado (jwt)
export const getProfile = async (req, res, next) => {
  try {
    // req.user proviene del authMiddleware
    res.status(200).json({
      success: true,
      data: req.user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    actualizar perfil personal del administrador
// @route   PUT /api/v1/auth/profile
// @access  privado (jwt)
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      })
    }

    // actualizar campos si fueron enviados
    user.nombre = req.body.nombre || user.nombre
    user.apellido = req.body.apellido || user.apellido
    user.telefono = req.body.telefono || user.telefono

    // si envia nueva contraseña, se asigna (se hasheara en el save())
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
      },
      message: 'Perfil actualizado correctamente',
    })
  } catch (error) {
    next(error)
  }
}