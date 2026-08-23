import mongoose from 'mongoose'

const companyInfoSchema = new mongoose.Schema(
  {
    nombreComercio: {
      type: String,
      required: [true, 'El nombre del comercio es obligatorio'],
      default: 'Vesta Propiedades',
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción institucional es obligatoria'],
    },
    direccion: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
    },
    email: {
      type: String,
      required: [true, 'El email de contacto es obligatorio'],
    },
    horariosAtencion: {
      type: String,
      required: [true, 'Los horarios de atención son obligatorios'],
    },
    redesSociales: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('CompanyInfo', companyInfoSchema)