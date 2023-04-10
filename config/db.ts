import mongoose, { ConnectOptions } from 'mongoose'

interface MongoOptions extends ConnectOptions {
  useNewUrlParser: boolean
  useUnifiedTopology: boolean
  useCreateIndex?: boolean
}
export const conectarDB = async (): Promise<void> => {
  try {
    const options: MongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
    const connection = await mongoose.connect(process.env.MONGO_URI!, options)
    const url = `${connection.connection.host}:${connection.connection.port}`
    console.log(`MongoDB Conectado en: ${url} `)
  } catch (error: any) {
    console.log(`MongoDB Error: ${error.message}`)
    process.exit(1)
  }
}
