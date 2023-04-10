import { Model } from 'mongoose'
import { msgError, msgExito } from '../helpers'
import {
  OptionsControllers,
  RequestWithLocal
} from '../interface/interfaceGlobal'
import { Response } from 'express'
type TModel = Model<any>
//Crear un nuevo registro

type NewEntrie = (
  options: OptionsControllers
) => (req: RequestWithLocal, res: Response) => Promise<void>
export const newEntrie: NewEntrie =
  ({ pushProp, pushProp2, ModelBase, Model, Model2, handler }) =>
  async (req, res) => {
    const doc = new Model(req.body)
    doc.local = req.local._id
    const saveModel = await ModelBase.findByIdAndUpdate(req.local._id, {
      $push: {
        [pushProp]: doc._id
      }
    })
    try {
      const docAlmacenado = await doc.save()
      handler && handler(docAlmacenado)
      if (req.body[pushProp2!]) {
        const saveModel2 = await Model2.findByIdAndUpdate(
          req.body[pushProp2!],
          {
            $push: {
              [pushProp]: doc._id
            }
          }
        )
        doc[pushProp2!] = req.body[pushProp2!]
        Promise.all([saveModel, saveModel2, docAlmacenado])
      }
      msgExito(docAlmacenado, res)
    } catch (error: any) {
      console.log(error)
    }
  }
//traer todos los registros
export const getAll = (model: TModel) => {
  return async (req: RequestWithLocal, res: Response) => {
    const all = await model
      .find({ local: req.local._id })
      .select(' -__v -password')
    msgExito(all, res)
  }
}
//traer un registro por id
export const getById =
  (modelo: TModel) => async (req: RequestWithLocal, res: Response) => {
    const documento = await modelo.findById!(req.params.id).select(
      ' -__v -password'
    )
    if (!documento) {
      msgError(res, 'No encontrado')
    }

    if (documento?.local.toString() !== req.local._id.toString()) {
      msgError(res, 'Accion no valida')
    }
    try {
      res.json(documento)
    } catch (error: any) {
      console.log(error)
      res.status(500).json({ mensaje: 'Error interno del servidor' })
    }
  }
//editar un registro por id
export const editById =
  (model: TModel) => async (req: RequestWithLocal, res: Response) => {
    const prop1 = await model.findById!(req.params.id)
    if (!prop1) {
      msgError(res, 'No encontrado')
    }
    if (prop1?.local.toString() !== req.local._id.toString()) {
      msgError(res, 'Accion no valida')
    }
    prop1!.nombre = req.body.nombre || prop1!.nombre
    prop1!.email = req.body.email || prop1!.email
    prop1!.telefono = req.body.telefono || prop1!.telefono
    prop1!.direccion = req.body.direccion || prop1!.direccion
    try {
      const propAct = await prop1?.save()
      res.json(propAct)
    } catch (error: any) {
      console.log(error)
    }
  }
type DeleteEntrie = (
  options: OptionsControllers
) => (req: RequestWithLocal, res: Response) => Promise<void>
//eliminar un registro por id
export const deleteById: DeleteEntrie =
  ({ pushProp, ModelBase, Model }) =>
  async (req, res) => {
    const prop1 = await Model.findById!(req.params.id)
    if (!prop1) {
      msgError(res, 'No encontrado')
    }
    if (prop1?.local.toString() !== req.local._id.toString()) {
      msgError(res, 'Accion no valida')
    }
    try {
      await prop1?.deleteOne()
      //eliminar el registro de la coleccion local
      await ModelBase.findByIdAndUpdate(req.local._id, {
        $pull: {
          [pushProp]: prop1?._id
        }
      })

      msgExito('Eliminado correctamente', res)
    } catch (error: any) {
      console.log(error)
    }
  }
