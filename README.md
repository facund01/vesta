# Vesta Propiedades

Vesta Propiedades es una plataforma web integral diseñada para la gestión y publicación de inmuebles. Ofrece un portal público moderno para visitantes interesados en comprar o alquilar propiedades, junto con un panel de administración privado para la gestión del inventario, categorías de inmuebles y configuraciones institucionales.

## Características Principales

### Portal Público

* **Búsqueda e Inventario:** Exploración de inmuebles por tipo de operación (Venta, Alquiler, Alquiler Temporal) y clasificaciones.

* **Detalle de Inmueble:** Ficha técnica con galerías de fotos, precio en moneda local/extranjera, ubicación, métricas y descripción detallada.

* **Formulario de Contacto:** Canal directo para que los clientes envíen consultas sobre inmuebles de su interés.

* **Sección Institucional:** Información sobre la empresa, ubicación y vías de comunicación cargadas dinámicamente.

### Panel Administrativo

* **Métricas y Tablero:** Vista rápida del estado del inventario y consultas recibidas.

* **Gestión de Propiedades:** Modales interactivos para crear, editar, pausar/activar y eliminar publicaciones. Soporte para destacar inmuebles en la portada.

* **Gestión de Categorías:** Alta y edición de clasificaciones (Departamentos, Casas, Terrenos, etc.).

* **Atención de Consultas:** Listado y seguimiento de las consultas de clientes ingresadas desde el sitio público.

* **Configuración Institucional:** Administración de datos de contacto, logo, redes sociales e información general de la inmobiliaria.

## Arquitectura y Tecnologías

El proyecto está estructurado bajo una arquitectura **Full Stack desacoplada** compuesta por:

* **Frontend:**

  * **React 18** con **Vite** para desarrollo y compilación rápida.

  * **React Router 6** para el manejo de rutas y layouts protegidos.

  * **React Portals** (`createPortal`) para la renderización de modales en el nivel raíz del DOM.

  * **Lucide React** para iconografía estandarizada.

  * **CSS3 / Flexbox / Grid** con animaciones de transición y diseño responsivo.

* **Backend:**

  * **Node.js** y **Express.js** como motor del servidor y API RESTful.

  * **MongoDB** como base de datos de documentos.

  * **Mongoose** como ODM para modelado de datos.

  * **JWT (JSON Web Tokens)** para autenticación y sesiones seguras en el panel de administración.

  * **CORS** para el intercambio seguro de recursos entre frontend y backend.

## Requisitos Previos

Asegurate de contar con el siguiente software instalado antes de iniciar:

1. **Node.js** (Versión 18.x o superior)

2. **Git**

3. **MongoDB** (Servidor local en puerto `27017` o una cuenta activa en MongoDB Atlas)

## Guía de Instalación Local

### 1. Clonar el Repositorio

```
git clone https://github.com/facund01/vesta.git
cd vesta

```

### 2. Configurar e Iniciar el Backend

1. Navegá a la carpeta del servidor e instalá las dependencias:

   ```
   cd backend
   npm install
   
   ```

2. Creá un archivo `.env` en la raíz de la carpeta `backend`:

   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/vesta_db
   JWT_SECRET=supersecret
   
   ```

3. Ejecutá el script de *seed* para cargar la base de datos inicial (categorías, inmuebles de demostración y la cuenta de administrador):

   ```
   npm run seed
   
   ```

   > **Credenciales de Administrador creadas por defecto:**
   >
   > * **Email:** `admin@vesta.com`
   >
   > * **Contraseña:** `Password123!`

4. Iniciá el servidor en modo desarrollo:

   ```
   npm run dev
   
   ```

   *El servidor quedará escuchando en `http://localhost:5000`.*

### 3. Configurar e Iniciar el Frontend

1. En una nueva ventana de terminal, navegá a la carpeta del cliente:

   ```
   cd vesta/frontend
   npm install
   
   ```

2. Creá un archivo `.env` en la raíz de la carpeta `frontend`:

   ```
   VITE_API_URL=http://localhost:5000/api/v1
   
   ```

3. Iniciá el entorno de desarrollo:

   ```
   npm run dev
   
   ```

4. Abrí el enlace proporcionado por Vite (usualmente `http://localhost:5173`) en tu navegador.

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
