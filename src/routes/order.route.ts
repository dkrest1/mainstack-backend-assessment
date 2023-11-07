import express from 'express';
import mongoose from 'mongoose';
import {ApiError} from '@/middlewares';
import httpStatus from 'http-status';
import { check } from 'express-validator';
import OrdersController from '@/controllers/order.controller';
import ProductModel from '@/models/product.model';
import { bodyValidate, orderValidate, RBACAuth } from '@/middlewares';
import { userRoles } from '@/constants';
import UserModel from '@/models/user.model';


const router = express.Router();

export default () => {
  const orders = new OrdersController();

  router.get('/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    [
      check('page').optional().isInt().toInt(),
      check('limit').optional().isInt().toInt(),
      check('staus').optional().isString().isIn(["pending", "processing", "shipped", "delivered"]),
    ],
    bodyValidate,
    orders.getOrder.bind(orders));

  router.get('/:orderId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    orderValidate,
    orders.findOrder.bind(orders));

  router.get('/details',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
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
    ],
    bodyValidate,
    orders.getOrderDetails.bind(orders));
    
  router.get('/:orderId/details',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    orderValidate,
    orders.findOrderDetails.bind(orders));

  router.post('/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF, userRoles.CUSTOMER),
    [
      check('customer_id').custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'invalid customer ID');
        }

        const customer = await UserModel.findById(value)

        if(!customer) {
          throw new ApiError(httpStatus.BAD_REQUEST, "customer record does not exist")
        }

        return value; 
      }).not().isEmpty(),
      check('total_amount').isNumeric().not().isEmpty(),
      check('status').isString().not().isEmpty().isIn(["pending", "processing", "shipped", "delivered"]),
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
      check('quantity').isNumeric().not().isEmpty(),
      check('sub_total').isNumeric().not().isEmpty(),
    ],
    bodyValidate,
    orders.createOrder.bind(orders));
  
  router.patch('/:orderId',
    orderValidate,
    [
      check('customer_id').custom(async (value) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'invalid customer ID');
        }

        const customer = await UserModel.findById(value)

        if(!customer) {
          throw new ApiError(httpStatus.BAD_REQUEST, "customer record does not exist")
        }

        return value; 
      }).optional(),
      check('total_amount').isNumeric().optional(),
      check('status').isString().optional().isIn(["pending", "processing", "shipped", "delivered"]),
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
      check('quantity').isNumeric().optional(),
      check('sub_total').isNumeric().optional(),
    ],
    bodyValidate,
    orders.updateOrder.bind(orders));
  
  router.delete('/:orderId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN),
    orderValidate,
    orders.deleteOrder.bind(orders));
  
  return router;
}
