import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    asunto: {
      type: String,
      required: [true, 'El asunto es obligatorio'],
      trim: true,
    },
    mensaje: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      minlength: [10, 'El mensaje debe tener al menos 10 caracteres'],
    },
    propiedad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Leída', 'Respondida'],
      default: 'Pendiente',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Inquiry', inquirySchema)