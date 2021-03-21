import { injectable } from 'inversify'
import { IFieldService } from './interfaces'
import Field from '../models/Notification'
import { Document } from 'mongoose'
import { ServerErrorException } from '../exceptions'
import { IFields } from '../interfaces/entities'

@injectable()
export default class FieldService implements IFieldService {
  async getFields(): Promise<Document<any>[]> {
    try {
      return await Field.find({})
    } catch (error) {
      console.log(error)
      throw ServerErrorException(error)
    }
  }
  async getField(id: string): Promise<Document<any>[]> {
    try {
      return await Field.find({ _id: id })
    } catch (error) {
      console.log(error)
      throw ServerErrorException(error)
    }
  }

  async createField(entity: IFields): Promise<Document<any>> {
    try {
      const field = new Field(entity)
      return await field.save()
    } catch (error) {
      throw ServerErrorException(error)
    }
  }

  async updateField(id: string, entity: IFields): Promise<Document<any>> {
    try {
      return await Field.findByIdAndUpdate(id, entity, { new: true })
    } catch (error) {
      throw ServerErrorException(error)
    }
  }

  async deleteField(id: string): Promise<Document<any>> {
    try {
      return await Field.findByIdAndDelete(id)
    } catch (error) {
      throw ServerErrorException(error)
    }
  }
}
