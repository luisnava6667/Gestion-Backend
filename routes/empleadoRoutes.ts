import express, { Router } from 'express'
import { checkAuth } from '../middleware'
import {
  editarEmpleado,
  eliminarEmpleado,
  nuevoEmpleado,
  obtenerEmpleado,
  obtenerEmpleados
} from '../controllers'
const router: Router = express.Router()

router
  .route('/')
  .get(checkAuth, obtenerEmpleados)
  .post(checkAuth, nuevoEmpleado)

router
  .route('/:id')
  .get(checkAuth, obtenerEmpleado)
  .put(checkAuth, editarEmpleado)
  .delete(checkAuth, eliminarEmpleado)

export { router as empleadosRoutes }
