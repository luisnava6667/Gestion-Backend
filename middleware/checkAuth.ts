import jwt from 'jsonwebtoken'
import Locales from '../models/LocalesModel'
import { Request, Response, NextFunction } from 'express'
import { ILocal } from '../interface/interfaceGlobal'

interface RequestWithLocales extends Request {
  local?: ILocal
}
interface ICheckAuth {
  (req: RequestWithLocales, res: Response, next: NextFunction): void
  name: string
}
interface TokenPayload {
  id: string
}
const checkAuth: ICheckAuth = async (
  req: RequestWithLocales,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined = ''
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const proces: string = process.env.JWT_SECRET!
      const decoded = jwt.verify(token, proces) as TokenPayload
      const { id } = decoded
      req.local = (await Locales.findById(id).select(
        '-password -confirmado -token -createdAt -updatedAt -__v'
      )) as ILocal
      return next()
    } catch (error: unknown) {
      return res.status(401).json({ msg: (error as Error).message })
    }
  }
  if (!token) {
    return res.status(401).json({ msg: 'No se proporcionó ningún token' })
  }
  next()
}

export default checkAuth
