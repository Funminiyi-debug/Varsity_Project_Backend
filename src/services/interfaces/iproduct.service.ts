import { Document } from 'mongoose'
import { IFilter, IProduct } from '../../interfaces/entities'
import IAppFile from '../../interfaces/entities/IAppFile'
import { Express } from 'express'

export default interface IProductService {
  getProducts(): Promise<Document<any>[]>

  getProduct(id: string): Promise<Document<any>[]>

  getProductsByCondition(query: IFilter): Promise<Document<any>[]>

  getProductFeedbacks(userid: string)

  createProduct(
    entity: IProduct,
    files: any,
    email: string,
  ): Promise<Document<any>>

  updateProduct(
    id: string,
    files: any,
    entity: any,
    userEmail: string,
  ): Promise<Document<any>>

  deleteProduct(id: string, userEmail: string): Promise<Document<any>>

  searchProduct(searchTerm: string): Promise<Document<any>[]>

  addFeedbackToProduct(
    productid: string,
    feedbackids: string,
    useremail: string,
  )
}
