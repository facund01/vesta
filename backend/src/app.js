import express from 'express'
import cors from 'cors'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// config de cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// ruta base para testear que la api responda
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API Vesta Propiedades operativa',
        environment: process.env.NODE_ENV,
    })
})

// middlewares globales de error
app.use(notFound)
app.use(errorHandler)

export default app