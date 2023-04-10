import { Request } from 'express'
import mongoose, { Document, Types } from 'mongoose'
interface ParamsBase extends Document {
  nombre?: string
  email: string
  password: string
  localNombre?: string
  direccion: string
  ciudad: string
  telefono: number
  token: string
  confirmado?: boolean
  suscripcion?: 'Free' | 'Premium'
  comprobarPassword?: (password: string) => Promise<boolean>
  sucursales?: Types.ObjectId[]
  productos?: Types.ObjectId[]
  empleados?: Types.ObjectId[]
  findById?: mongoose.Model<any, {}>['findById']
}
export interface ILocal extends ParamsBase {}
export interface ISucursal extends ParamsBase {
  nombreSucursal: string
  local: Types.ObjectId
}
export interface IEmpleados extends ParamsBase {
  sucursal: Types.ObjectId[]
  local: Types.ObjectId
}
//*Funciones
export interface RequestWithLocal extends Request {
  local?: any
}
export interface OptionsControllers {
  pushProp: string
  pushProp2?: string
  ModelBase: any
  Model: any
  Model2?: any
  handler?: (doc: any) => void
}