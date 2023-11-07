import express from 'express';
import mongoose from 'mongoose';
import { check } from 'express-validator';
import httpStatus from 'http-status';
import { bodyValidate, transactionValidate, RBACAuth, ApiError } from '@/middlewares';
import TransactionsController from '@/controllers/transaction.controller';
import { userRoles } from '@/constants';
import ProductModel from '@/models/product.model';


const router = express.Router();

export default () => {
  const transactions = new TransactionsController();

  router.get('/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    [
      check('page').optional().isInt().toInt(),
      check('limit').optional().isInt().toInt(),
      check('type').isString().isIn(["purchase", "sale", "return", "transfer", "adjustment", "damage", "loss", "other"]).optional(),
    ],
    bodyValidate,
    transactions.getTransaction.bind(transactions));

  router.get('/:transactionId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    transactionValidate,
    transactions.findTransaction.bind(transactions));

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
      check('quantity_change').isNumeric().toInt().not().isEmpty(),
      check('type').isString().isIn(["purchase", "sale", "return", "transfer", "adjustment", "damage", "loss", "other"]).not().isEmpty(),
    ],
    bodyValidate,
    transactions.createTransaction.bind(transactions));
  
  router.patch('/:transactionId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    transactionValidate,
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
      check('quantity_change').isNumeric().toInt().optional(),
      check('type').isString().isIn(["purchase", "sale", "return", "transfer", "adjustment", "damage", "loss", "other"]).optional(),
    ],
    bodyValidate,
    transactions.updateTransaction.bind(transactions));
  
  router.delete('/:transactionId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN),
    transactionValidate,
    transactions.deleteTransaction.bind(transactions));

  return router;
}
