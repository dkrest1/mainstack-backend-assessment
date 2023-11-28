import express from 'express'
import mongoose from 'mongoose'
import { check } from 'express-validator'
import { bodyValidate, reviewValidate, ApiError, RBACAuth } from '@/middlewares'
import httpStatus from 'http-status'
import ReviewController from '@/controllers/review.controller'
import ProductModel from '@/models/product.model'
import UserModel from '@/models/user.model'
import { userRoles } from '@/constants'

const router = express.Router()

export default () => {
  const review = new ReviewController()

  router.get(
    '/',
    [
      check('product_id')
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid product ID')
          }

          const product = await ProductModel.findById(value)

          if (!product) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'product record does not exist')
          }

          return value
        })
        .optional(),

      check('customer_id')
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid customer ID')
          }

          const customer = await UserModel.findById(value)

          if (!customer) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'customer record does not exist')
          }

          return value
        })
        .optional(),

      check('rating').isNumeric().isInt({ min: 1, max: 5 }).toInt(),
    ],
    bodyValidate,
    review.getReview.bind(review),
  )

  router.get(
    '/:reviewId',
    RBACAuth(
      userRoles.SUPER_ADMIN,
      userRoles.ADMIN,
      userRoles.STAFF,
      userRoles.MANUFACTURER,
      userRoles.SUPPLIER,
      userRoles.CUSTOMER,
    ),
    reviewValidate,
    review.findReview.bind(review),
  )

  router.post(
    '/',
    RBACAuth(
      userRoles.SUPER_ADMIN,
      userRoles.ADMIN,
      userRoles.STAFF,
      userRoles.MANUFACTURER,
      userRoles.SUPPLIER,
      userRoles.CUSTOMER,
    ),
    [
      check('product_id')
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid product ID')
          }

          const product = await ProductModel.findById(value)

          if (!product) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'product record does not exist')
          }

          return value
        })
        .optional(),

      check('customer_id')
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid customer ID')
          }

          const customer = await UserModel.findById(value)

          if (!customer) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'customer record does not exist')
          }

          return value
        })
        .optional(),

      check('rating').isNumeric().isInt({ min: 1, max: 5 }).toInt(),
      check('text').isString().optional(),
    ],
    bodyValidate,
    review.addReview.bind(review),
  )

  router.delete(
    '/:reviewId',
    RBACAuth(
      userRoles.SUPER_ADMIN,
      userRoles.ADMIN,
      userRoles.STAFF,
      userRoles.MANUFACTURER,
      userRoles.SUPPLIER,
      userRoles.CUSTOMER,
    ),
    reviewValidate,
    review.deleteReview.bind(review),
  )

  return router
}
