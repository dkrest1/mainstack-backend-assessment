import express from 'express';
import product from './product.route';

const router = express.Router();

export default () => {
    router.use('/products', product());

    return router;
}