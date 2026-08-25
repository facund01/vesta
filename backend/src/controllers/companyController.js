import CompanyInfo from '../models/CompanyInfo.js'

// @desc    obtener informacion institucional del comercio
// @route   GET /api/v1/company
// @access  publico
export const getCompanyInfo = async (req, res, next) => {
  try {
    let company = await CompanyInfo.findOne()

    // su ayb no se inicializo, crea el registro por defecto
    if (!company) {
      company = await CompanyInfo.create({
        nombreComercio: 'Vesta Inmobiliaria',
        descripcion: 'Especialistas en propiedades residenciales y comerciales',
        direccion: 'Av. Corrientes 1500, CABA, Argentina',
        telefono: '+54 11 4000-0000',
        email: 'contacto@vesta.com',
        horariosAtencion: 'Lunes a Viernes de 9:00 a 18:00 hs',
        redesSociales: {
          instagram: 'https://instagram.com/vestainmobiliaria',
          facebook: '',
          whatsapp: '+54 9 11 4000-0000',
          linkedin: ''
        }
      })
    }

    res.status(200).json({
      success: true,
      data: company
    })
  } catch (error) {
    next(error)
  }
}

// @desc    actualizar informacion institucional del comercio
// @route   PUT /api/v1/company
// @access  privado (jwt)
export const updateCompanyInfo = async (req, res, next) => {
  try {
    let company = await CompanyInfo.findOne()

    if (!company) {
      company = await CompanyInfo.create(req.body)
    } else {
      company.nombreComercio = req.body.nombreComercio || company.nombreComercio
      company.descripcion = req.body.descripcion || company.descripcion
      company.direccion = req.body.direccion || company.direccion
      company.telefono = req.body.telefono || company.telefono
      company.email = req.body.email || company.email
      company.horariosAtencion = req.body.horariosAtencion || company.horariosAtencion

      if (req.body.redesSociales) {
        company.redesSociales = {
          ...company.redesSociales,
          ...req.body.redesSociales
        }
      }

      await company.save()
    }

    res.status(200).json({
      success: true,
      data: company,
      message: 'Información institucional actualizada correctamente'
    })
  } catch (error) {
    next(error)
  }
}