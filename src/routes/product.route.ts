import express from 'express';
import { check } from 'express-validator';
import ProductsController from '@/controllers/product.controller';

const router = express.Router();

export default () => {
  const products = new ProductsController();

  router.post('/institutions/login',
  
    products.createProduct.bind(products));

  return router;
}
