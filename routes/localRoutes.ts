import express, { Router } from 'express'
import {
  autenticarLocal,
  confirmarLocal,
  crearLocal,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from '../controllers/localControllers'
import checkAuth from '../middleware/checkAuth'
const router: Router = express.Router()

router.post('/', crearLocal)
router.post('/login', autenticarLocal)
router.get('/confirmar/:token', confirmarLocal)
router.post('/olvide-password', olvidePassword)
router.route('/olvidePassword/:token').post(comprobarToken).put(nuevoPassword)
router.get('/perfil', checkAuth, perfil)

// router.post('/crearEpleados/:id', crearEmpleados)
// router.get('/getEmpleados/:id', getAllEmpleados)

// router.post('/login', loginLocal)
// router.put('/updateLocal/:id', updateLocal)
// router.post('/crearSucursal/:id', crearSucursal)
// router.get('/sucursales/:id', getSucursales)
// router.delete('/delsucur/:id', deleteSucursal)
// router.put('/updatesucur/:id', updateSucursal)
// router.get('/:id/sucursalId/:sucursalId', getSucursalId)
// router.get('/:id/getEmpleadoId/:empleadoId', getEmpleadoId)
// router.get('/:id/updateEmpleado/:empleadoId', updateEmpleado)

export { router as localRoutes }
