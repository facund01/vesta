import 'dotenv/config'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Property from '../models/Property.js'
import CompanyInfo from '../models/CompanyInfo.js'
import Inquiry from '../models/Inquiry.js'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB Conectado para Seeding')
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`)
    process.exit(1)
  }
}

const importData = async () => {
  try {
    await connectDB()

    // 1. Limpiar base de datos
    await User.deleteMany()
    await Category.deleteMany()
    await Property.deleteMany()
    await CompanyInfo.deleteMany()
    await Inquiry.deleteMany()

    console.log('Colecciones anteriores vaciadas...')

    // 2. Crear Administrador Inicial
    const adminUser = await User.create({
      nombre: 'Administrador',
      apellido: 'Vesta',
      email: 'admin@vesta.com',
      password: 'Password123!',
      telefono: '+54 11 4000-1111'
    })

    // 3. Crear Información Institucional
    await CompanyInfo.create({
      nombreComercio: 'Vesta Inmobiliaria Boutique',
      descripcion: 'Agencia inmobiliaria especializada en comercialización y gestión de propiedades premium y residenciales en Buenos Aires.',
      direccion: 'Av. Corrientes 1500, Balvanera, CABA',
      telefono: '+54 11 4888-9999',
      email: 'contacto@vesta.com',
      horariosAtencion: 'Lunes a Viernes de 9:00 a 19:00 hs - Sábados de 10:00 a 14:00 hs',
      redesSociales: {
        instagram: 'https://instagram.com/vestainmobiliaria_ok',
        facebook: 'https://facebook.com/vestainmobiliaria',
        whatsapp: '+54 9 11 4888-9999',
        linkedin: 'https://linkedin.com/company/vesta-inmobiliaria'
      }
    })

    // 4. Crear Categorías
    const createdCategories = await Category.insertMany([
      {
        nombre: 'Departamentos',
        descripcion: 'Departamentos residenciales, semipisos, monoambientes y penthouses'
      },
      {
        nombre: 'Casas',
        descripcion: 'Casas familiares, chalets, dúplex y propiedades en barrios cerrados'
      },
      {
        nombre: 'PH',
        descripcion: 'Propiedades horizontales sin expensas con patio o terraza'
      },
      {
        nombre: 'Locales Comerciales',
        descripcion: 'Locales a la calle, oficinas corporativas y espacios comerciales'
      },
      {
        nombre: 'Terrenos',
        descripcion: 'Lotes residenciales e industriales aptos para desarrollo'
      }
    ])

    const catDeptos = createdCategories[0]._id
    const catCasas = createdCategories[1]._id
    const catPH = createdCategories[2]._id
    const catLocales = createdCategories[3]._id
    const catTerrenos = createdCategories[4]._id

    // 5. Crear 21 Propiedades
    const sampleProperties = [
      {
        titulo: 'Semipiso 3 Ambientes con Balcón Aterrazado',
        direccion: 'Av. Medrano 950, Almagro, CABA',
        categoria: catDeptos,
        descripcion: 'Espectacular semipiso al frente, súper luminoso. Living comedor amplio, cocina integrada con isla, 2 dormitorios (principal en suite con vestidor) y gran balcón terraza.',
        precio: 165000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 85,
        ambientes: 3
      },
      {
        titulo: 'Monoambiente Divisible a Estrenar',
        direccion: 'Gascón 720, Almagro, CABA',
        categoria: catDeptos,
        descripcion: 'Unidad funcional al contrafrente con vista abierta. Cocina con anafe y horno eléctrico, baño completo con bañera y balcón corrido. Amenities: piscina y SUM.',
        precio: 72000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 38,
        ambientes: 1
      },
      {
        titulo: 'Departamento 2 Ambientes en Alquiler',
        direccion: 'Av. Corrientes 4200, Almagro, CABA',
        categoria: catDeptos,
        descripcion: 'Excelente 2 ambientes a metros del Subte B. Dormitorio con placard espejado, living comedor con salida a balcón, pisos flotantes y aire acondicionado split.',
        precio: 420000,
        moneda: 'ARS',
        tipoOperacion: 'Alquiler',
        imagenes: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 48,
        ambientes: 2
      },
      {
        titulo: 'Casa Estilo Minimalista con Piscina',
        direccion: 'Barrio Cerrado Los Robles, Pilar, Bs.As.',
        categoria: catCasas,
        descripcion: 'Propiedad moderna desarrollada en 2 plantas sobre lote central de 800m2. Galería con parrilla, piscina climatizada, 4 dormitorios, playroom y cochera doble techada.',
        precio: 340000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 280,
        ambientes: 5
      },
      {
        titulo: 'Chalet Tradicional 4 Ambientes con Jardín',
        direccion: 'Calle Güemes 1420, Vicente López, Bs.As.',
        categoria: catCasas,
        descripcion: 'Chalet de tejas en impecable estado de conservación. Amplio jardín arbolado con quincho, 3 dormitorios en planta alta, garage para dos autos y cocina comedor diario.',
        precio: 290000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Reservado',
        activa: true,
        destacada: false,
        superficieM2: 220,
        ambientes: 4
      },
      {
        titulo: 'PH 3 Ambientes con Terraza Propia y Parrilla',
        direccion: 'Serrano 1100, Villa Crespo, CABA',
        categoria: catPH,
        descripcion: 'PH reciclado íntegramente a nuevo. Sin expensas. Entrada independiente, techos altos con bovedilla a la vista, living integrado y terraza exclusiva de 45m2.',
        precio: 178000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 110,
        ambientes: 3
      },
      {
        titulo: 'PH 2 Ambientes en Alquiler sin Expensas',
        direccion: 'Vera 450, Villa Crespo, CABA',
        categoria: catPH,
        descripcion: 'Primer piso por escalera con patio propio y lavadero cubierto. Muy silencioso y con excelente ventilación natural.',
        precio: 380000,
        moneda: 'ARS',
        tipoOperacion: 'Alquiler',
        imagenes: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 52,
        ambientes: 2
      },
      {
        titulo: 'Local Comercial en Esquina Estratégica',
        direccion: 'Av. Rivadavia 4900, Caballito, CABA',
        categoria: catLocales,
        descripcion: 'Gran esquina comercial con 15 metros de vidriera sobre avenida con altísimo tránsito peatonal y vehicular. Doble altura, sótano depósito y baños para damas y caballeros.',
        precio: 1200000,
        moneda: 'ARS',
        tipoOperacion: 'Alquiler',
        imagenes: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 160,
        ambientes: 2
      },
      {
        titulo: 'Oficina Corporativa en Torre Premium',
        direccion: 'Av. Leandro N. Alem 850, Retiro, CABA',
        categoria: catLocales,
        descripcion: 'Planta libre con divisiones vidriadas modulares, sala de reuniones ejecutiva, comedor para empleados, seguridad 24hs y 2 cocheras fijas en subsuelo.',
        precio: 240000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 140,
        ambientes: 4
      },
      {
        titulo: 'Lote Residencial en Barrio Cerrado',
        direccion: 'Ruta 28 Km 5, General Rodríguez, Bs.As.',
        categoria: catTerrenos,
        descripcion: 'Excelente lote de 1200m2 con fondo al lago central. Terreno nivelado, listo para construir con planos aprobados y servicios soterrados.',
        precio: 65000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 1200,
        ambientes: 1
      },
      {
        titulo: 'Departamento 4 Ambientes con Dependencia',
        direccion: 'Av. del Libertador 4600, Palermo, CABA',
        categoria: catDeptos,
        descripcion: 'Piso exclusivo con vista panorámica a los Bosques de Palermo. Palier privado, master suite, hidromasaje, cocina con isla y 2 cocheras cubiertas.',
        precio: 520000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 195,
        ambientes: 4
      },
      {
        titulo: 'Departamento 2 Ambientes Amoblado Temporal',
        direccion: 'Thames 2100, Palermo Soho, CABA',
        categoria: catDeptos,
        descripcion: 'Totalmente equipado con diseño contemporáneo. Smart TV, Wi-Fi alta velocidad, vajilla completa, balcón al frente. Edificio con laundry y piscina.',
        precio: 650,
        moneda: 'USD',
        tipoOperacion: 'Alquiler Temporal',
        imagenes: [
          'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00d?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 45,
        ambientes: 2
      },
      {
        titulo: 'Casa Quinta con Parque y Cancha de Pádel',
        direccion: 'Calle Los Ciruelos 450, Del Viso, Bs.As.',
        categoria: catCasas,
        descripcion: 'Parque arbolado de 2500m2, quincho cerrado con asador criollo, vestuarios, casa principal de 4 ambientes y casa de caseros.',
        precio: 275000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 320,
        ambientes: 5
      },
      {
        titulo: 'PH 4 Ambientes Tipo Casa con Cochera',
        direccion: 'Boedo 850, Boedo, CABA',
        categoria: catPH,
        descripcion: 'Al frente, totalmente independiente. Cochera cubierta propia, 3 amplios dormitorios, patio central andaluz con cerramiento corredizo y terraza con quincho.',
        precio: 215000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 145,
        ambientes: 4
      },
      {
        titulo: 'Local Gastronómico Habilitado',
        direccion: 'Honduras 5500, Palermo Hollywood, CABA',
        categoria: catLocales,
        descripcion: 'Local totalmente montado para gastronomía con tiraje a los 4 vientos, cámara frigorífica, salón para 80 comensales y deck exterior sobre vereda.',
        precio: 1800000,
        moneda: 'ARS',
        tipoOperacion: 'Alquiler',
        imagenes: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 180,
        ambientes: 3
      },
      {
        titulo: 'Fracción Industrial Apta Logística',
        direccion: 'Autopista Panamericana Km 38, Garín, Bs.As.',
        categoria: catTerrenos,
        descripcion: 'Fracción de 5.000m2 con zonificación industrial exclusiva. Excelente accesibilidad para camiones de gran porte, energía trifásica y gas industrial.',
        precio: 450000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 5000,
        ambientes: 1
      },
      {
        titulo: 'Departamento 3 Ambientes con Cochera Fija',
        direccion: 'Av. Pedro Goyena 1200, Caballito, CABA',
        categoria: catDeptos,
        descripcion: 'Ubicado en el polo gastronómico de Caballito. Balcón al frente, calefacción por losa radiante individual, caldera dual y cochera en planta baja.',
        precio: 210000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 78,
        ambientes: 3
      },
      {
        titulo: 'Monoambiente en Alquiler Amoblado',
        direccion: 'Billinghurst 1600, Recoleta, CABA',
        categoria: catDeptos,
        descripcion: 'A pasos del Alto Palermo Shopping. Cama matrimonial rebatible, escritorio para home office, cocina integrada y baño con mampara de vidrio.',
        precio: 360000,
        moneda: 'ARS',
        tipoOperacion: 'Alquiler',
        imagenes: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 32,
        ambientes: 1
      },
      {
        titulo: 'Triplex 4 Ambientes con Playroom',
        direccion: 'Melo 2300, Florida Miter, Vicente López',
        categoria: catCasas,
        descripcion: 'Triplex moderno con entrada de auto, patio con parrilla, 3 dormitorios en el segundo nivel y gran playroom o 4to dormitorio en el último piso.',
        precio: 235000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 165,
        ambientes: 4
      },
      {
        titulo: 'PH 3 Ambientes en Planta Baja con Jardín',
        direccion: 'Montañeses 1900, Belgrano Chico, CABA',
        categoria: catPH,
        descripcion: 'Inmueble único por su jardín privado de 60m2 con frondosa vegetación. Living con ventanales de piso a techo, cocina reciclada y 2 baños completos.',
        precio: 260000,
        moneda: 'USD',
        tipoOperacion: 'Venta',
        imagenes: [
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: true,
        superficieM2: 130,
        ambientes: 3
      },
      {
        titulo: 'Piso Completo de Oficinas con Vista al Río',
        direccion: 'Av. Alicia Moreau de Justo 1100, Puerto Madero, CABA',
        categoria: catLocales,
        descripcion: 'Piso corporativo AAA en el Dique 3. Cableado por piso técnico, aire acondicionado central VRV, batería de sanitarios y 4 cocheras subterráneas.',
        precio: 4200,
        moneda: 'USD',
        tipoOperacion: 'Alquiler',
        imagenes: [
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80'
        ],
        estado: 'Disponible',
        activa: true,
        destacada: false,
        superficieM2: 260,
        ambientes: 5
      }
    ]

    await Property.insertMany(sampleProperties)

    // 6. Crear Consultas de Prueba
    const insertedProperties = await Property.find().limit(2)
    await Inquiry.insertMany([
      {
        nombre: 'Mariano Rossi',
        email: 'mariano.rossi@gmail.com',
        telefono: '+54 11 5522-8811',
        asunto: 'Consulta sobre el Semipiso en Almagro',
        mensaje: 'Buenas tardes, quisiera saber si las expensas incluyen el agua y cuándo se puede visitar.',
        propiedad: insertedProperties[0]._id,
        estado: 'Pendiente'
      },
      {
        nombre: 'Sofía Álvarez',
        email: 'sofia.alvarez@hotmail.com',
        telefono: '+54 11 6633-9944',
        asunto: 'Tasación de inmueble particular',
        mensaje: 'Hola, tengo una casa en Vicente López y me gustaría coordinar una tasación con ustedes.',
        propiedad: null,
        estado: 'Leída'
      }
    ])

    console.log('✅ Base de datos precargada con éxito:')
    console.log(' - 1 Usuario Administrador (admin@vesta.com / Password123!)')
    console.log(' - 1 Perfil Institucional')
    console.log(` - ${createdCategories.length} Categorías`)
    console.log(` - ${sampleProperties.length} Propiedades`)
    console.log(' - 2 Consultas de Contacto')

    process.exit(0)
  } catch (error) {
    console.error(`❌ Error al cargar datos: ${error.message}`)
    process.exit(1)
  }
}

importData()