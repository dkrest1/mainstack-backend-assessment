import express from 'express';
import mongoose from 'mongoose';
import { check } from 'express-validator';
import { bodyValidate, discountValidate, ApiError, RBACAuth } from '@/middlewares';
import DiscountsController from '@/controllers/discount.controller';
import httpStatus from 'http-status';
import { userRoles } from '@/constants';
import ProductModel from '@/models/product.model';


const router = express.Router();

export default () => {
  const discounts = new DiscountsController();

  router.get('/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF, userRoles.MANUFACTURER, userRoles.SUPPLIER, userRoles.CUSTOMER),
    [
      check('page').optional().isInt().toInt(),
      check('limit').optional().isInt().toInt(),
      check('product_id').custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'invalid product ID');
        }

        const product = await ProductModel.findById(value)

        if(!product) {
          throw new ApiError(httpStatus.BAD_REQUEST, "product record does not exist")
        }

        return value; 
      }).optional(),
      check('amount').isNumeric().toInt().optional(),
      check('start_date').isISO8601().toDate().optional(),
      check('end_date').isISO8601().toDate().optional(),
    ],
    bodyValidate,
    discounts.getDiscount.bind(discounts));

  router.get('/:discountId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF, userRoles.MANUFACTURER, userRoles.SUPPLIER, userRoles.CUSTOMER),
    discountValidate,
    discounts.findDiscount.bind(discounts));

  router.post('/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    [
      check('product_id').custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'invalid product ID');
        }

        const product = await ProductModel.findById(value)

        if(!product) {
          throw new ApiError(httpStatus.BAD_REQUEST, "product record does not exist")
        }

        return value; 
      }).not().isEmpty(),
      check('amount').isNumeric().not().isEmpty(),
      check('start_date').isISO8601().toDate().not().isEmpty(),
      check('end_date').isISO8601().toDate().not().isEmpty(),
  
    ],
    bodyValidate,
    discounts.createDiscount.bind(discounts));
  
  router.patch('/:discountId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    discountValidate,
    [
      check('product_id').custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'invalid product ID');
        }

        const product = await ProductModel.findById(value)

        if(!product) {
          throw new ApiError(httpStatus.BAD_REQUEST, "product record does not exist")
        }

        return value; 
      }).optional(),
      check('amount').isNumeric().toInt().optional(),
      check('start_date').isISO8601().toDate().optional(),
      check('end_date').isISO8601().toDate().optional(),
    ],
    bodyValidate,
    discounts.updateDiscount.bind(discounts));
  
  router.delete('/:discountId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN),
    discountValidate,
    discounts.deleteDiscount.bind(discounts));
  
  return router;
}
