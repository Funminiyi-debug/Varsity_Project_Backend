import { Document } from 'mongoose'
import { inject, injectable } from 'inversify'
import {
  IProductService,
  IUserService,
  IFeedbackService,
  IAppFileService,
  ISubcategoryService,
  ICategoryService,
} from './interfaces'
import Product from '../models/Product'
import Types from '../types'
import { IProduct, IFilter } from '../interfaces/entities'
import {
  BadDataException,
  ConflictException,
  NotFoundException,
  ServerErrorException,
} from '../exceptions'
import '../utils/flatArray'
import checkCondition, { checkPriceRange } from '../utils/checkCondition'
import { isReturnStatement } from 'typescript'
interface IProductCreate extends IProduct {
  author: string
  images: any[]
  subcategory: string
  category: string
}

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject(Types.IAppFileService) private appfileService: IAppFileService,
    @inject(Types.ISubcategoryService)
    private subcategoryService: ISubcategoryService,
    @inject(Types.ICategoryService)
    private categoryService: ICategoryService,
  ) {}

  async searchProduct(searchTerm: string): Promise<Document<any>[]> {
    //  takeCount = takeCount == undefined ? 10 : takeCount;
    //  pageNo = pageNo == undefined ? 1 : pageNo;
    //  const skip = (pageNo - 1) * takeCount;
    const allProducts = await Product.find({
      $text: { $search: searchTerm },
    })
      .populate({ path: 'author', select: 'userName email' })
      .populate({ path: 'subcategory', select: 'name' })
      .populate({ path: 'category', select: 'name' })
      .populate({ path: 'images', select: 'mimetype name' })
      .populate('feedbacks')

    searchTerm = searchTerm.toLowerCase()

    function checkConditions(element: any) {
      const {
        subcategory,
        category,
        author,
        school,
        price,
        otherFields,
      } = element
      let isProduct = false
      let isService = false
      if (element.subcategory != undefined) {
        isProduct = true
      }
      if (element.category != undefined) {
        isService = true
      }

      return (
        (isProduct && subcategory.name.toLowerCase().includes(searchTerm)) ||
        (isService && category.name.toLowerCase().includes(searchTerm)) ||
        (author != null &&
          author.userName.toLowerCase().includes(searchTerm)) ||
        otherFields.some((item) =>
          Object.values(item).some((val) =>
            val.toString().toLowerCase().includes(searchTerm),
          ),
        )
      )
    }
    const toReturn = allProducts.filter(checkConditions)

    return toReturn
  }
  async addFeedbackToProduct(
    productid: string,
    feedbackids: string,
    useremail: string,
  ) {
    return await Product.findByIdAndUpdate(productid, {
      $addToSet: {
        feedbacks: feedbackids,
      },
    })
  }
  async getProducts(): Promise<Document<any>[]> {
    return await Product.find({})
      .populate('author', { userName: 1, email: 1 })
      .populate('subcategory')
      //   .populate({ path: "images", select: "mimetype" })
      .populate('feedback')
      .populate('category')
      .populate('feedbacks')

    // return await this.appfileService.getAllAppFiles();
  }

  // get product
  async getProduct(id: string): Promise<Document<any>[]> {
    return await Product.find({})
      .populate('author', { userName: 1, email: 1 })
      .populate('subcategory')
      // .populate({ path: "images", select: "mimetype" })
      .populate('feedback')
      .populate('category')
      .populate('feedbacks')
  }

  async getProductFeedbacks(userid: string) {
    const results = await Product.find({ author: userid })
      .populate('author', { userName: 1, email: 1 })
      .populate('feedback')

    const feedbacks = results.map((result) => {
      const feeds = result['feedbacks'].filter((data) => data.author !== userid)
      return { ...result, feedbacks: feeds }
    })

    return feedbacks
  }

  // search for product
  async getProductsByCondition(query: IFilter): Promise<Document<any>[]> {
    let {
      name,
      school,
      priceMax,
      priceMin,
      sortBy,
      delivery,
      otherFields,
      takeCount,
      pageNo,
    }: IFilter = query

    if (otherFields == undefined) otherFields = []
    const sortedData =
      sortBy === 'Newest'
        ? { timestamps: 'descending' } // or { _id: -1 }
        : sortBy === 'Highest Price'
        ? { price: 1 }
        : sortBy === 'Lowest Price'
        ? { price: -1 }
        : { timestamps: 'descending' }

    sortBy = sortBy == undefined ? '' : sortBy
    priceMax = priceMax == undefined ? Number.MAX_SAFE_INTEGER : priceMax
    priceMin = priceMin == undefined ? 0 : priceMin
    takeCount = takeCount == undefined ? 10 : takeCount
    pageNo = pageNo == undefined ? 1 : pageNo
    const skip = (pageNo - 1) * takeCount

    const allProducts = (await Product.find({})
      .limit(takeCount)
      .skip(skip)
      // price: { $gte: priceMin, $lte: priceMax },
      .populate({ path: 'author', select: 'userName email' })
      .populate({ path: 'subcategory', select: 'name' })
      .populate({ path: 'category', select: 'name' })
      //   .populate({ path: "images" })
      .populate('feedbacks')
      .sort(sortedData)) as any[]

    const isProduct = allProducts.filter(
      (element) =>
        element.subcategory != null || element.subcategory != undefined,
    )
    const isService = allProducts.filter(
      (element) => element.category != null || element.category != undefined,
    )

    const products: Document<any>[] = isProduct.filter(
      (element) =>
        checkCondition(element.subcategory.name, name) &&
        checkPriceRange(element.price, priceMax, priceMin) &&
        checkCondition(element.school, school) &&
        checkCondition(element.delivery, delivery),
    )

    const services: Document<any>[] = isService.filter(
      (element) =>
        checkCondition(element.category.name, name) &&
        checkPriceRange(element.price, priceMax, priceMin),
    )

    let toReturn = [...products, ...services].flat(Infinity)

    // check other conditions
    if (otherFields.length > 0) {
      toReturn = toReturn.filter((element: any) => {
        const check: boolean = element.otherFields
          .map((item) => {
            const condition = Object.keys(item).every((key) => {
              const position = otherFields.findIndex((field) => {
                return Object.keys(field).every((key2) => {
                  return key2 == key
                })
              })
              if (position >= 0) {
                return checkCondition(
                  item[key].toString(),
                  otherFields[position][key],
                )
              }

              return false
            })
            return condition
          })
          .some((element) => element == true)

        return check
      })
    }

    return toReturn.sort((a: any, b: any) => {
      if (sortBy.toLowerCase() == 'lowest price') return a.price - b.price
      if (sortBy.toLowerCase() == 'highest price') return b.price - a.price
      return a.updatedAt > b.updatedAt ? 1 : -1
    })
  }

  // create product
  async createProduct(
    product: IProduct,
    files: any,
    userid: string,
  ): Promise<Document<any>> {
    const entity: IProductCreate = {
      ...product,
      author: '',
      images: [],
      subcategory: '',
      category: '',
    }

    const isProduct: boolean = product.subcategoryId != undefined

    // AUTHOR

    entity.author = userid

    // Check if product exists
    const exists = await Product.find({
      title: entity.title,
      author: entity.author,
    })

    if (exists.length > 0) throw new ConflictException('Product already exist')

    // IMAGE
    if (!files || files.length == 0) {
      throw new BadDataException('you must include images')
    }

    const imageids = await Promise.all([
      ...files.map(async (file) => {
        const appfile = await this.appfileService.addAppFile(file)
        return appfile.id
      }),
    ])
    // await Promise.all(imageids);
    entity.images = imageids

    // SUBCATEGORY
    if (isProduct) {
      const subcategoryExist = await this.subcategoryService.getSubcategory(
        entity.subcategoryId,
      )

      if (subcategoryExist.length == 0) {
        imageids.forEach(
          async (id) => await this.appfileService.deleteAppFile(id),
        )
        throw new BadDataException('subcategory does not exist')
      }

      entity.subcategory = subcategoryExist[0].id
      delete entity.category
    } else {
      // CATEGORY
      const categoryExist = await this.categoryService.getCategory(
        entity.categoryId,
      )
      if (categoryExist.length == 0) {
        imageids.forEach(
          async (id) => await this.appfileService.deleteAppFile(id),
        )
        throw new BadDataException('category does not exist')
      }

      entity.category = categoryExist[0].id
      delete entity.subcategory
    }

    try {
      const product = await Product.create(entity)

      await this.subcategoryService.addProductToSubcategory(
        entity.subcategoryId,
        product.id,
      )

      return product
    } catch (error) {
      console.log(error)
      throw new ServerErrorException(error)
    }
  }

  // update product
  async updateProduct(
    id: string,
    files: any,
    product: any,
    userid,
  ): Promise<Document<any>> {
    const entity: IProductCreate = {
      ...product,
      subcategory: '',
      category: '',
      images: [],
    }

    // AUTHOR
    entity.author = userid

    // Check if product exists
    const exists = (await Product.findOne({
      _id: id,
      author: userid,
    })) as any

    if (!exists) throw new NotFoundException('product not found')

    //Product
    const subcategoryExist = await this.subcategoryService.getSubcategory(
      entity.subcategoryId,
    )

    if (subcategoryExist.length == 0) {
      entity.subcategory = exists.subcategoryId
    } else {
      entity.subcategory = subcategoryExist[0].id
    }

    //Service
    const categoryExist = await this.categoryService.getCategory(
      entity.categoryId,
    )

    if (categoryExist.length == 0) {
      entity.category = exists.categoryId
    } else {
      entity.category = categoryExist[0].id
    }

    // IMAGE
    if (files || files.length > 0) {
      const imageids = await Promise.all([
        ...files.map(async (file) => {
          const appfile = await this.appfileService.addAppFile(file)
          return appfile.id
        }),
      ])
      entity.images = [...entity.images, ...imageids]
    } else {
      entity.images = exists.images
    }

    try {
      const product = await Product.findByIdAndUpdate(id, entity, {
        new: true,
      })

      return product
    } catch (error) {
      console.log(error)
      throw new ServerErrorException(error)
    }
  }

  // delete product
  async deleteProduct(
    productid: string,
    userid: string,
  ): Promise<Document<any>> {
    try {
      // return await Product.deleteMany();
      const product = await Product.findOne({
        _id: productid,
        author: userid,
      })
      if (product) return await product.remove()
      throw new NotFoundException('product not found')
    } catch (error) {
      throw error
    }
  }
}
