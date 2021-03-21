import { Document } from 'mongoose'
import { IUser } from '../interfaces/entities'
import User from '../models/User'
import {
  ICommentService,
  IFeedbackService,
  IPostService,
  IProductService,
  IUserService,
} from './interfaces'
import { inject, injectable } from 'inversify'
import { NotFoundException, ServerErrorException } from '../exceptions'
import UsersController from '../controllers/user.controller'
import VerificationStatus from '../enums/VerificationStatus'
import handleAppExceptions from '../utils/handleAppExceptions'
import UnauthorizedException from '../exceptions/UnauthorizedException'
import SavedAds from '../models/SavedAds'
import Types from '../types'
import Product from '../models/Product'
import { Chat } from '../interfaces/SocketInterfaces'

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(Types.IPostService) private postService: IPostService,
    @inject(Types.ICommentService) private commentService: ICommentService,
    @inject(Types.IFeedbackService) private feedbackService: IFeedbackService,
    @inject(Types.IProductService) private productService: IProductService,
  ) {}
  async getUsers() {
    try {
      return await User.find({}).populate('savedAds')
    } catch (error) {
      throw new ServerErrorException(error)
    }
  }

  async updateUser(id: string, entity: IUser) {
    try {
      return await User.findByIdAndUpdate(id, entity)
    } catch (error) {
      throw new ServerErrorException(error)
    }
  }

  async updateVerificationStatus(id: string, status: VerificationStatus) {
    try {
      return await User.findByIdAndUpdate(id, {
        $set: { verificationStatus: status },
      })
    } catch (error) {
      throw new ServerErrorException(error)
    }
  }

  async getUser(userid: string) {
    try {
      const user = await (await User.findById(userid)).toObject()
      const userProfileData = await this.getUserProfileDetails(userid)
      return {
        ...user,
        ...userProfileData,
      }
    } catch (error) {
      throw ServerErrorException(error)
    }
  }

  async getUserByCondition(query: IUser): Promise<Document<any>[]> {
    try {
      return await User.find(query)
    } catch (error) {
      throw new ServerErrorException(error)
    }
  }

  async getByEmail(email: string): Promise<Document<IUser>> {
    try {
      const user = await User.findOne({ email })
      return user
    } catch (error) {
      throw new ServerErrorException(error)
    }
  }

  async deleteUser(id: string): Promise<Document<any>> {
    try {
      return await (await User.findById(id)).remove()
    } catch (error) {
      throw new ServerErrorException(error)
    }
  }

  async saveAd(productid: string, userid: string): Promise<Document<any>> {
    try {
      const user = await this.getUser(userid)

      if (!user) throw new UnauthorizedException('You have to be logged In')

      const product = await Product.findById(productid)

      if (!product) throw new NotFoundException('ad not found')

      const savedAd = await User.findByIdAndUpdate(user._id, {
        $addToSet: { savedAds: productid },
      })

      return await savedAd.save()
    } catch (error) {
      console.log(error)

      throw error
    }
  }

  //user profiles @dami
  private async getUserProfileDetails(userid) {
    const userPosts = await this.postService.getPostsByUser(userid)
    const userLikesOnPost = await this.postService.getPostsLikedByUser(userid)
    const usersCommentsOnPost = await this.commentService.getCommentsByUser(
      userid,
    )
    const userFeedbacks = await this.feedbackService.getFeedbacksSentByUser(
      userid,
    )

    const userProducts = await this.productService.getProductsByUser(userid)
    // const allOtherFeedbacks = await this.feedbackService.getFeedbacksReceivedByUser(
    //   userid,
    // )

    const receivedFeedbacks = await this.productService.getProductFeedbacks(
      userid,
    )

    return {
      userProducts,
      userPosts,
      userLikesOnPost,
      usersCommentsOnPost,
      userFeedbacks,
      receivedFeedbacks,
    }
  }
}
