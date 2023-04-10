import express from 'express'
import dotenv from 'dotenv'

// import cors from 'cors'
import { conectarDB } from './config/db'
import { localRoutes } from './routes/localRoutes'
import { empleadosRoutes } from './routes/empleadoRoutes'
import { sucursalesRoutes } from './routes/sucursalesRoutes'
const app = express()
app.use(express.json())
dotenv.config()
conectarDB()

// Configurar CORS
// const whitelist = [process.env.FRONTEND_URL]
// const corsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) => {
//     if (origin && whitelist.includes(origin)) {
//       // Puede consultar la API
//       callback(null, true)
//     } else {
//       // No está permitido
//       callback(new Error('Error de Cors'))
//     }
//   }
// }
// app.use(cors(corsOptions))
const PORT: number = 3001
app.use('/local', localRoutes)
app.use('/empleados', empleadosRoutes)
app.use('/sucursales', sucursalesRoutes)
app.listen(PORT, () => {
  console.log(`⚡️ Server running on port ${PORT}!!!`)
})
