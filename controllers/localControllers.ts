import { Response } from 'express'
import {
  catchError,
  msgError,
  msgExito,
} from '../helpers/controllersUtils'
import { ILocal } from '../interface/interfaceGlobal'
import { Request as ExpressRequest } from 'express'
import { emailOlvidePassword, emailRegistro } from '../helpers/sendEmail'
import { Locales } from '../models'
import { generarId, generarJWT } from '../helpers'
// import { emailRegistro } from '../helpers/sendEmail'
// import Empleados from '../models/EmpleadosModel'
export const crearLocal = async (req: Request, res: Response) => {
  const { email } = req.body
  const localExiste = await Locales.findOne({ email })
  if (localExiste) {
    return msgError(res, 'Ya hay un local registrado con ese email')
  }
  try {
    const local = new Locales(req.body)
    local.token = generarId()
    await local.save()
    emailRegistro({ email, nombre: local.nombre!, token: local.token })
    return msgExito(local, res, 201)
  } catch (error: any) {
    return catchError(res, error)
  }
}

//autenticar local
export const autenticarLocal = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const local = await Locales.findOne({ email })
  if (!local) {
    return msgError(res, 'El local no existe')
  }
  if (!local.confirmado) {
    return msgError(res, 'El local no esta activo por favor confirme su email')
  }
  if (await local.comprobarPassword!(password)) {
    return res.status(200).json({
      _id: local._id,
      nombre: local.nombre,
      email: local.email,
      token: generarJWT(local._id)
    })
  } else {
    return msgError(res, 'El password es incorrecto')
  }
}
export const confirmarLocal = async (req: Request, res: Response) => {
  const { token } = req.params
  const localConfirmar = await Locales.findOne({ token })
  if (!localConfirmar) {
    return msgError(res, 'El token no es correcto')
  }
  try {
    localConfirmar.confirmado = true
    localConfirmar.token = ''
    await localConfirmar.save()
    return msgExito('El local se ha confirmado correctamente', res)
  } catch (error: any) {
    return catchError(res, error)
  }
}
export const olvidePassword = async (req: Request, res: Response) => {
  const { email } = req.body
  const local = await Locales.findOne({ email })
  if (!local) {
    return msgError(res, 'El local no existe')
  }
  try {
    local.token = generarId()
    await local.save()
    emailOlvidePassword({ email, nombre: local.nombre!, token: local.token })
    return msgExito('Se ha enviado un mail para recuperar su password', res)
  } catch (error: any) {
    return catchError(res, error)
  }
}
export const comprobarToken = async (req: Request, res: Response) => {
  const { token } = req.params
  const tokenValido = await Locales.findOne({ token })
  if (tokenValido) {
    return msgExito('El token es valido', res)
  } else {
    return msgError(res, 'El token no es valido')
  }
}
export const nuevoPassword = async (req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body
  const local = await Locales.findOne({ token })
  if (local) {
    local.password = password
    local.token = ''
    try {
      await local.save()
      return msgExito('Se ha cambiado el password correctamente', res)
    } catch (error: any) {
      return catchError(res, error)
    }
  } else {
    return msgError(res, 'El token no es valido')
  }
}

interface Request extends ExpressRequest {
  local?: ILocal
}
export const perfil = async (req: Request, res: Response) => {
  const { local } = req
  return res.json(local)
}


// export const updateLocal = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { nombre, email, localNombre, direccion, ciudad, telefono }: ILocal =
//     req.body
//   const local = await Locales.findById(id)
//   if (!local) {
//     return msgError(res, 'Local no encontrado')
//   }
//   try {
//     await Locales.updateOne(
//       { nombre, email, localNombre, direccion, ciudad, telefono },
//       { new: true }
//     )
//   } catch (error: any) {
//     return catchError(res, error)
//   }
//   msgExito('Local actualizado correctamente', res)
// }
// export const crearSucursal = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { email } = req.body
//   const local = await Locales.findById(id)
//   const sucursalExist = await Sucursales.findOne({ email })
//   if (!local) {
//     return msgError(res, 'Local no encontrado')
//   } else if (sucursalExist) {
//     return msgError(res, 'Ya hay una sucursal registrada con ese email')
//   }
//   try {
//     const sucursal = await Sucursales.create(req.body)
//     sucursal.localCreador = local._id
//     local.sucursales!.push(sucursal._id)
//     promiseAll(local, sucursal)
//     return msgExito('Sucursal creada con exito', res, 201)
//     // await Promise.all([local.save(), sucursal.save()])
//     // return res.status(201).json({ msg: 'Sucursal creada con exito' })
//   } catch (error: any) {
//     return catchError(res, error)
//   }
// }
// export const getSucursales = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const local = await Locales.findById(id).populate({
//     path: 'sucursales',
//     select: '-_id -empleados -__v -password'
//   })
//   if (!local) {
//     return msgError(res, 'Local no encontrado')
//   }
//   const sucursales = local?.sucursales
//   try {
//     return msgExito(sucursales!, res)
//   } catch (error: any) {
//     return catchError(res, error)
//   }
// }
// export const getSucursalId = async (req: Request, res: Response) => {
//   const { id, sucursalId } = req.params
//   const sucursal = await Sucursales.findById(sucursalId).select(
//     '-_id -__v -password -suscripcion'
//   )
//   const local = await Locales.findById(id)
//   if (!local || !sucursal) {
//     return msgError(res, 'Local o Sucursal no encontrado')
//   }
//   if (id !== sucursal.localCreador) {
//     return msgError(res, 'No puede acceder a esta sucursal')
//   }
//   try {
//     return msgExito(sucursal, res)
//   } catch (error: any) {
//     return catchError(res, error)
//   }
// }
// export const deleteSucursal = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { sucursalId } = req.body
//   const { localExiste, sucursalExiste } = await multipleSearch(
//     Locales,
//     Sucursales,
//     id,
//     sucursalId
//   )
//   try {
//     if (!sucursalExiste || !localExiste) {
//       return msgError(res, 'Local o Sucursal no encontrados')
//     }
//     const idLocal = localExiste._id.toString()
//     const localCreador = sucursalExiste.localCreador
//     if (idLocal !== localCreador) {
//       return msgError(res, 'No tienes permisos para borrar esta sucursal')
//     }
//     if (localExiste.sucursales && Array.isArray(localExiste.sucursales)) {
//       localExiste.sucursales = localExiste.sucursales.filter(
//         (sucursal) => sucursal.toString() !== sucursalId
//       )
//       await localExiste.save()
//       await Sucursales.findByIdAndRemove(sucursalId)
//     }
//     msgExito('Sucursal Borrada con Exito', res)
//   } catch (error: any) {
//     return catchError(res, error)
//   }
// }
// export const updateSucursal = async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { nombreSucursal, email, direccion, telefono, ciudad }: ISucursal =
//     req.body
//   const sucursal = await Sucursales.findById(id)
//   if (!sucursal) {
//     return msgError(res, 'Sucursal no encontrada')
//   }
//   try {
//     await sucursal.updateOne({
//       nombreSucursal,
//       email,
//       direccion,
//       telefono,
//       ciudad
//     })
//     return msgExito('Sucursal Actualizada correctamente', res)
//   } catch (error: any) {
//     return catchError(res, error)
//   }
// }

// export const getEmpleadoId = async (req: Request, res: Response) => {
//   const { id, empleadoId } = req.params
//   const local = await Locales.findById(id)
//   const empleado = await Empleados.findById(empleadoId)
//     .select('-local -password -_id -__v')
//     .populate({
//       path: 'sucursales',
//       select: '-_id -empleados -__v -password'
//     })
//   if (!local) {
//     return msgError(res, 'Local no encotrado')
//   }
//   if (!empleado) {
//     return msgError(res, 'Empleado no encotrado')
//   }
//   try {
//     return msgExito(empleado, res)
//   } catch (error: any) {
//     return catchError(res, error)
//   }
// }
// export const updateEmpleado = async (req: Request, res: Response) => {
//   const { id, empleadoId } = req.params

// }
// export const deleteEmpleado = async (req: Request, res: Response) => {}
//Login del local
// export const loginLocal = async (req: Request, res: Response) => {
//   const { email, password } = req.body
//   const local = await Locales.findOne({ email })

//   if (local === null) {
//     return msgError(res, 'El email no es correcto')
//   }
//   if (await local!.comprobarPassword!(password)) {
//     res.json({
//       _id: local._id,
//       nombre: local.nombre,
//       email: local.email,
//       token: generarJWT(local._id)
//     })
//   } else {
//     return msgError(res, 'Si olvidate la contraseña comunicate con soporte')
//   }
// }
