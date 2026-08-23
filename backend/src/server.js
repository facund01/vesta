import dotenv from 'dotenv'
dotenv.config() // carga las variables del .env

import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

const startServer = async () => {
    // 1. conectar a mongodb atlas
    await connectDB()

    // 2. iniciar el servidor http
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV}`)
    })
}

startServer()