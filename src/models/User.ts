import mongoose from 'mongoose'
import Post from './Post'
import Comment from './Comment'
import AppFile from './AppFile'
import Product from './Product'
import Feedback from './Feedback'
import VerificationStatus from '../enums/VerificationStatus'
import { number } from 'joi'

const UserShema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      default: function () {
        return `${this.firstName}_${this.lastName}`
      },
    },
    email: {
      type: String,
      required: true,
    },
    profilePics: {
      type: String,
    },
    phone: {
      type: String,
    },
    phoneCode: {
      type: String,
    },
    verifyCode: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      required: true,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    allowEmailNotification: {
      type: Number,
      default: false,
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: [
        VerificationStatus.NotVerified,
        VerificationStatus.Verified,
        VerificationStatus.Restricted,
      ],
      default: VerificationStatus.NotVerified,
    },
    savedAds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    businessName: {
      type: String,
    },
    whatsappNo: {
      type: String,
    },
    website: { type: String },
    aboutCompany: { type: String },
  },
  { timestamps: true },
)

UserShema.pre('remove', function (next) {
  Comment.remove({ postid: this._id }).exec()
  Post.remove({ author: this._id }).exec()
  AppFile.remove({ postid: this._id }).exec()
  Product.remove({ author: this._id }).exec()
  Feedback.remove({ author: this._id }).exec()
  next()
})

export default mongoose.model('User', UserShema)
