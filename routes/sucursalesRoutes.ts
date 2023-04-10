import express, { Router } from 'express'
import { checkAuth } from '../middleware'
import {
  editarSucursal,
  eliminarSucursal,
  nuevaSucursal,
  obtenerSucursal,
  obtenerSucursales
} from '../controllers'
const router: Router = express.Router()

router
  .route('/')
  .get(checkAuth, obtenerSucursales)
  .post(checkAuth, nuevaSucursal)
router
  .route('/:id')
  .get(checkAuth, obtenerSucursal)
  .put(checkAuth, editarSucursal)
  .delete(checkAuth, eliminarSucursal)

  export { router as sucursalesRoutes }