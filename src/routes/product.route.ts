import express from 'express'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import { check } from 'express-validator'
import { bodyValidate, productValidate, ApiError, RBACAuth } from '@/middlewares'
import ProductsController from '@/controllers/product.controller'
import UserModel from '@/models/user.model'
import { userRoles } from '@/constants'

const router = express.Router()

export default () => {
  const products = new ProductsController()

  router.get(
    '/',
    RBACAuth(
      userRoles.SUPER_ADMIN,
      userRoles.ADMIN,
      userRoles.STAFF,
      userRoles.CUSTOMER,
    ),
    [
      check('page').optional().isInt().toInt(),
      check('limit').optional().isInt().toInt(),
      check('category').optional().isString(),
      check('price').optional().isFloat(),
    ],
    bodyValidate,
    products.getProduct.bind(products),
  )

  router.get(
    '/:productId',
    RBACAuth(
      userRoles.SUPER_ADMIN,
      userRoles.ADMIN,
      userRoles.STAFF,
      userRoles.CUSTOMER,
    ),
    productValidate,
    products.findProduct.bind(products),
  )

  router.post(
    '/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    [
      check('name').exists().isString().escape(),
      check('description').exists().isString().escape(),
      check('sku').exists().isString().escape(),
      check('price').exists().isNumeric().escape(),
      check('file.data').optional().isString().escape(),
      check('file.title').optional().isString().escape(),
      check('quantity').exists().isNumeric().escape(),
      check('categories').optional().isArray(),
      check('categories.*').optional().isString(),
      check('manufacturer')
        .optional()
        .isString()
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid manufacturer ID')
          }

          const manufacturer = await UserModel.findById(value)

          if (!manufacturer) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturer record does not exist')
          }

          return value
        })
        .escape(),
      check('supplier')
        .optional()
        .isString()
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid supplier ID')
          }

          const supplier = await UserModel.findById(value)

          if (!supplier) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'supplier record does not exist')
          }

          return value
        })
        .escape(),
    ],
    bodyValidate,
    products.addProduct.bind(products),
  )

  router.patch(
    '/:productId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    productValidate,
    [
      check('name').optional().isString().escape(),
      check('description').optional().isString().escape(),
      check('sku').optional().isString().escape(),
      check('price').optional().isNumeric().toInt().escape(),
      check('file.data').optional().isString().escape(),
      check('file.title').optional().isString().escape(),
      check('quantity').optional().isNumeric().toInt().escape(),
      check('categories').optional().isArray(),
      check('categories.*').optional().isString(),
      check('manufacturer')
        .optional()
        .isString()
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid manufacturer ID')
          }

          const manufacturer = await UserModel.findById(value)

          if (!manufacturer) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'manufacturer record does not exist')
          }

          return value
        })
        .escape(),
      check('supplier')
        .optional()
        .isString()
        .custom(async (value) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'invalid supplier ID')
          }

          const supplier = await UserModel.findById(value)

          if (!supplier) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'supplier record does not exist')
          }

          return value
        })
        .escape(),
    ],
    bodyValidate,
    products.updateProduct.bind(products),
  )

  router.delete(
    '/:productId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN),
    productValidate,
    products.deleteProduct.bind(products),
  )

  return router
}
