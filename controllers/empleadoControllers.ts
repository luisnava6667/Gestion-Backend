import { OptionsControllers } from '../interface/interfaceGlobal'
import { Empleados, Locales, Sucursales } from '../models'
import { deleteById, editById, getAll, getById, newEntrie } from './Controllers'
const options: OptionsControllers = {
  pushProp: 'empleados',
  pushProp2: 'sucursales',
  Model2: Sucursales,
  ModelBase: Locales,
  Model: Empleados
}

export const nuevoEmpleado = newEntrie(options)
export const obtenerEmpleados = getAll(Empleados)
export const obtenerEmpleado = getById(Empleados)
export const editarEmpleado = editById(Empleados)
export const eliminarEmpleado = deleteById(options)
