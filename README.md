# Vesta Propiedades - Aplicación Web Inmobiliaria

Aplicación web integral para la promoción y administración de propiedades e inmuebles.

El sistema implementa una arquitectura desacoplada basada en una **API REST en NodeJS/Express** y un frontend reactivo en **React**. Cuenta con un sitio público orientado a visitantes y potenciales clientes, junto con un panel de administración privado y protegido para la gestión de publicaciones, categorías, mensajes de contacto e información institucional.

---

## Características Principales

### Sitio Público (Visitantes)
* **Catálogo interactivo:** Visualización de propiedades activas con imágenes, precios, descripción y estado de disponibilidad (*Disponible, Reservado, Alquilado, Vendido*).
* **Búsqueda y filtros dinámicos:** Búsqueda textual por palabras clave/ubicación y filtrado dinámico por categoría de inmueble y tipo de operación (Venta/Alquiler).
* **Ficha de detalle:** Vista individual con galería de fotos e información técnica.
* **Formulario de contacto:** Envío y almacenamiento de consultas directas en base de datos asociadas o no a una propiedad específica.
* **Información institucional:** Visualización de horarios, datos de contacto, dirección y redes sociales del negocio.

### Panel de Administración (Backoffice)
* **Autenticación y perfil:** Registro, inicio de sesión seguro mediante JSON Web Tokens (JWT), recuperación de contraseña y edición de datos personales.
* **Gestión de propiedades (CRUD):** Creación, edición, eliminación y control de visibilidad (activar/desactivar) de publicaciones.
* **Gestión de categorías (CRUD):** Alta, baja y modificación de tipos de inmuebles (Casas, Departamentos, Terrenos, Locales).
* **Bandeja de consultas:** Listado de mensajes recibidos con seguimiento por estados (*Pendiente, Leída, Respondida*).
* **Administración institucional:** Actualización de la información del comercio en tiempo real.
* **Dashboard estadístico:** Resumen de métricas clave sobre inmuebles activos y consultas pendientes.

---

## Tecnologías Utilizadas

### Backend
* **Entorno de ejecución:** Node.js (ES Modules)
* **Framework web:** Express.js
* **Base de datos:** MongoDB Atlas (NoSQL)
* **ODM / Modelado:** Mongoose
* **Seguridad y autenticación:** JSON Web Tokens (`jsonwebtoken`) y `bcryptjs` para hashing de claves
* **Validación de entradas:** `express-validator`
* **Servicio de correo:** `nodemailer`
* **Manejo de CORS:** `cors`

### Frontend *(En desarrollo)*
* **Librería principal:** React (SPA con Vite)
* **Enrutamiento:** React Router DOM
* **Cliente HTTP:** Axios
* **Iconografía:** Lucide React

---

## Estructura del Proyecto

```text
vesta/
├── backend/                  # Servidor de API REST
│   ├── src/
│   │   ├── config/           # Conexión a MongoDB Atlas y configuración de servicios
│   │   ├── controllers/      # Controladores de peticiones HTTP
│   │   ├── middlewares/      # Middlewares de Auth (JWT), validación y errores
│   │   ├── models/           # Esquemas de Mongoose (User, Property, Category, etc.)
│   │   ├── routes/           # Definición de rutas y endpoints de la API
│   │   ├── seeds/            # Script de inicialización y precarga de datos (20+ items)
│   │   ├── utils/            # Utilidades (firmado JWT, formateadores)
│   │   ├── app.js            # Configuración de Express, CORS y middlewares
│   │   └── server.js         # Arranque del servidor HTTP
│   ├── .env.example          # Plantilla de variables de entorno
│   └── package.json          # Dependencias y scripts del backend
└── frontend/                 # Aplicación cliente en React (Vite)
```

---

### Requisitos Previos
* Node.js v18 o superior instalado.
* Cuenta en MongoDB Atlas (o instancia local de MongoDB).
* Git para clonar el repositorio.

---

### Instalación y Puesta en Marcha (Backend)
1. Clonar el repositorio y acceder a la carpeta del backend:
```
git clone <URL_DEL_REPOSITORIO>
cd vesta/backend
```
2. Instalar dependencias:
```
npm install
```
3. Configurar variables de entorno: Copiar el archivo ```.env.example``` a ```.env```:
```
cp .env.example .env
```
Completar las variables requeridas:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.mongodb.net/vesta_db?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
4. Ejecutar el servidor en modo desarrollo:
```
npm run dev
```
El servidor estará escuchando en http://localhost:5000 con recarga automática ante cambios.

---

### Documentación de la API
Los endpoints principales se encuentran agrupados bajo el prefijo ```/api/v1```:
* **Autenticación:** ```/api/v1/auth``` (```/register```, ```/login```, ```/profile```, ```/forgot-password```)

* **Propiedades:** ```/api/v1/properties``` (CRUD público y administrativo)
* **Categorías:** ```/api/v1/categories``` (CRUD de tipos de propiedad)
* **Consultas:** ```/api/v1/inquiries``` (Recepción y gestión de mensajes)
* **Información Institucional:** ```/api/v1/company``` (Datos del comercio)
* **Estadísticas:** ```/api/v1/stats``` (Métricas del dashboard administrativo)