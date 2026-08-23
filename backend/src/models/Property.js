import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'El tipo de propiedad es obligatorio'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
    },
    precio: {
      type: Number,
      default: 0,
      min: [0, 'El precio no puede ser negativo'],
    },
    moneda: {
      type: String,
      enum: ['USD', 'ARS'],
      default: 'USD',
    },
    tipoOperacion: {
      type: String,
      enum: ['Venta', 'Alquiler', 'Alquiler Temporal'],
      default: 'Venta',
    },
    imagenes: {
      type: [String],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Debe incluir al menos una imagen',
      },
    },
    estado: {
      type: String,
      enum: ['Disponible', 'Reservado', 'Alquilado', 'Vendido'],
      default: 'Disponible',
    },
    activa: {
      type: Boolean,
      default: true,
    },
    destacada: {
      type: Boolean,
      default: false,
    },
    superficieM2: {
      type: Number,
      default: 0,
    },
    ambientes: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

// indice de texto para habilitar busquedas por palabra clave
propertySchema.index({ titulo: 'text', direccion: 'text', descripcion: 'text' });

export default mongoose.model('Property', propertySchema)