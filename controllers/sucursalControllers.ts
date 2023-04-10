import { msgError, msgExito } from '../helpers'
import {
  OptionsControllers,
  RequestWithLocal
} from '../interface/interfaceGlobal'
import { Sucursales, Locales, Empleados } from '../models'
import { deleteById, editById, getAll, getById, newEntrie } from './Controllers'
import { Response } from 'express'
const options: OptionsControllers = {
  pushProp: 'sucursales',
  ModelBase: Locales,
  Model: Sucursales
}

export const nuevaSucursal = newEntrie(options)
export const obtenerSucursales = getAll(Sucursales)
export const obtenerSucursal = getById(Sucursales)
export const editarSucursal = editById(Sucursales)
export const eliminarSucursal = deleteById(options)
//agrego un empleado a una sucursal
export const agregarEmpleado = async (req: RequestWithLocal, res: Response) => {
  const { idSucursal, idEmpleado } = req.params
  const sucursal = await Sucursales.findById(idSucursal)
  const empleado = await Empleados.findById(idEmpleado)
  if (!sucursal || !empleado) {
    msgError(res, 'No se encontro la sucursal o el empleado')
    return
  }
  if(sucursal.empleados?.includes(empleado._id)){
    msgError(res, 'El empleado ya esta en la sucursal')
   
  }
  if(empleado.local)
  sucursal?.empleados!.push(empleado._id)
  empleado.sucursales!.push(sucursal._id)
  const sucursalActualizada = await sucursal.save()
  const empleadoActualizado = await empleado.save()
  msgExito({ sucursalActualizada, empleadoActualizado }, res)
}
