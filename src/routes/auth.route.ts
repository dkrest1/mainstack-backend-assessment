import express from 'express';
import { check } from 'express-validator';
import { bodyValidate, RBACAuth } from '@/middlewares';
import authController from '@/controllers/auth.controller';
import { userRoles } from '@/constants';

const router = express.Router();

export default () => {
    const auths = new authController();

    router.post('/login',
      [
        check('email').exists().isEmail().escape(),
        check('password').exists().isString().escape()
      ],
      bodyValidate,
      auths.login.bind(auths));

    router.post('/register',
      [
        check('name').exists().isString().escape(),
        check('password').exists().isString().escape(),
        check('email').exists().isString().escape(),
        check('username').exists().isString().escape(),
        check("address").exists().isString().escape(),
        check("phone").exists().isString().escape(),
        check("role").isString().exists().isIn(["staff", "manufacturer", "supplier", "customer"]).escape(),
      ],
      bodyValidate,
      auths.createUser.bind(auths));

    router.post('/register/admin',
      RBACAuth(userRoles.SUPER_ADMIN),
      [
        check('name').exists().isString().escape(),
        check('password').exists().isString().escape(),
        check('email').exists().isString().escape(),
        check('username').exists().isString().escape(),
        check("address").exists().isString().escape(),
        check("phone").exists().isString().escape(),
        check("role").isString().exists().isIn(["admin", "super_admin"]).escape(),
      ],
      bodyValidate,
      auths.createUser.bind(auths));

  return router;
}
