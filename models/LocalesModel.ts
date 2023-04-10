import { model, Schema } from 'mongoose'
import { ILocal } from '../interface/interfaceGlobal'

import bcrypt from 'bcrypt'

const localSchema = new Schema<ILocal>({
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
  localNombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  telefono: {
    type: Number,
    required: true
  },
  token: {
    type: String
  },
  suscripcion: {
    type: String,
    enum: ['Free', 'Premium'],
    default: 'Free'
  },
  confirmado: {
    type: Boolean,
    default: false
  },
  sucursales: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sucursales'
    }
  ],
  empleados: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Empleados'
    }
  ]
})
localSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
localSchema.methods.comprobarPassword = async function (
  passwordFormulario: string | Buffer
) {
  return await bcrypt.compare(passwordFormulario, this.password)
}
const Locales = model<ILocal>('Locales', localSchema)
export default Locales
