import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El tipo de propiedad es obligatorio'],
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// generar slug antes de validar/guardar (ej: "Locales Comerciales" -> "locales-comerciales")
categorySchema.pre('save', function () {
  if (this.isModified('nombre')) {
    this.slug = this.nombre
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');
  }
})

export default mongoose.model('Category', categorySchema)