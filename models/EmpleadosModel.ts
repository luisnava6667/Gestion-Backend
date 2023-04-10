import { model, Schema } from 'mongoose'
import { IEmpleados } from '../interface/interfaceGlobal'
import bcrypt from 'bcrypt'

const empleadoSchema = new Schema<IEmpleados>({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  telefono: {
    type: Number,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  local: {
    type: Schema.Types.ObjectId,
    ref: 'Locales'
  },
  sucursales: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sucursales'
    }
  ]
})
empleadoSchema.pre<IEmpleados>('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
empleadoSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}
const Empleados = model<IEmpleados>('Empleados', empleadoSchema)
export default Empleados
