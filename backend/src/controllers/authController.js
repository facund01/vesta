import User from '../models/User.js'
import { generateToken } from '../utils/jwt.js'
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail.js'

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

// @desc    solicitar recuperacion de contraseña (envia email con link/token)
// @route   POST /api/v1/auth/forgot-password
// @access  publico
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe ningún usuario con ese correo electrónico'
      })
    }

    // generar token aleatorio
    const resetToken = crypto.randomBytes(20).toString('hex')

    // hashear token y guardarlo en el usuario con expiracion de 10 minutos
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000

    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    const message = `Has solicitado reestablecer tu contraseña en Vesta Inmobiliaria.\n\nIngresá al siguiente enlace para continuar:\n${resetUrl}\n\nSi no lo solicitaste vos, podés ignorar este correo.`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Recuperación de contraseña - Vesta Inmobiliaria',
        message,
        html: `
          <h3>Recuperación de contraseña</h3>
          <p>Solicitaste restablecer tu contraseña. Hacé clic en el siguiente botón:</p>
          <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
          <p style="margin-top: 15px; font-size: 12px; color: #666;">Este enlace expira en 10 minutos.</p>
        `
      })

      res.status(200).json({
        success: true,
        message: 'Correo de recuperación enviado exitosamente'
      })
    } catch (err) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()

      return res.status(500).json({
        success: false,
        message: 'Error al enviar el correo electrónico'
      })
    }
  } catch (error) {
    next(error)
  }
}

// @desc    restablecer contraseña mediante token
// @route   PUT /api/v1/auth/reset-password/:token
// @access  publico
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de recuperación inválido o expirado'
      })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}