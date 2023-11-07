import express from 'express';
import productRoute from './product.route';
import usersRoute from './users.route';
import authRoute from './auth.route';
import orderRoute from './order.route';
import discountRoute from './discount.route';
import reviewRoute from './review.route';
import transactionRoute from './transaction.route';


const router = express.Router();

export default () => {
    router.use('/auth', authRoute());
    router.use('/users', usersRoute());
    router.use('/products', productRoute());
    router.use('/orders', orderRoute());
    router.use('/discounts', discountRoute());
    router.use('/reviews', reviewRoute());
    router.use('/transactions', transactionRoute());
    
    return router;
}