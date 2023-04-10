import jwt from 'jsonwebtoken'

const generarJWT = (id: any) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('La variable de entorno JWT_SECRET no está definida.')
  }
  return jwt.sign({ id }, secret, {
    expiresIn: '30d'
  })
}
export default generarJWT
