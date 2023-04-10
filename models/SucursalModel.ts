import { model, Schema } from 'mongoose'
import { ISucursal } from '../interface/interfaceGlobal'
import bcrypt from 'bcrypt';


const sucursalSchema = new Schema<ISucursal>(
  {
    nombreSucursal: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
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
    local: {
      type: Schema.Types.ObjectId,
      ref: 'Locales'
    },
    suscripcion: {
      type: String,
      enum: ['Free', 'Premium'],
      default: 'Free'
    },
    empleados: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Empleados'
      }
    ]
  },
  { strict: false }
)
sucursalSchema.pre<ISucursal>('save', async function (next) {
   if (!this.isModified('password')) {
     next()
   }
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})
sucursalSchema.methods.matchPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}
const Sucursales = model<ISucursal>('Sucursales', sucursalSchema)
export default Sucursales
