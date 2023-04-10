
import { Model } from 'mongoose'
import {
  IEmpleados,
  ILocal,
  ISucursal,
} from '../interface/interfaceGlobal'
import { Response } from 'express'
export function msgError(res: Response, msg: string): Response {
  const error: Error = new Error(msg)
  return res.status(400).json({ error: error.message })
}
export const msgExito = (
  msg: string | {} | [],
  res: Response,
  code?: number
) => {
  if (code === undefined) {
    code = 200
  }
  if (typeof msg === 'object') {
    return res.status(code).json(msg)
  }
  return res.status(code).json({ msg })
}
export const catchError = (res: Response, error: Error): Response => {
  return res.status(404).json({ error: error.message })
}
export const promiseAll = async (
  prop1: any,
  prop2: any,
  prop3?: any
): Promise<void> => {
  const promises = [prop1.save(), prop2.save()]
  if (prop3) {
    promises.push(prop3.save())
  }
  await Promise.all(promises)
}

export const multipleSearch = async (
  prop1: Model<ILocal>,
  prop2: Model<ISucursal>,
  id: string,
  id1: string,
  prop3?: Model<IEmpleados>,
  email?: string
): Promise<{
  localExiste: ILocal | null
  sucursalExiste: ISucursal | null
  empleadoExiste: IEmpleados | null
}> => {
  const localExiste = await prop1.findById(id)
  const sucursalExiste = await prop2.findById(id1)
  const empleadoExiste = await prop3!.findOne({ email })
  return { localExiste, sucursalExiste, empleadoExiste }
}
