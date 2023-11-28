import express from 'express'
import { check } from 'express-validator'
import UsersController from '@/controllers/user.controller'
import { auth, ApiError, RBACAuth, bodyValidate, userValidate } from '@/middlewares'
import { userRoles } from '@/constants'

const router = express.Router()

export default () => {
  const users = new UsersController()

  router.get(
    '/',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    [
      check('page').optional().isInt().toInt(),
      check('limit').optional().isInt().toInt(),
      check('role').optional().isString().isIn(['admin', 'staff', 'supplier', 'manufacturer', 'customer']),
    ],
    bodyValidate,
    users.getUser.bind(users),
  )

  router.get(
    '/:userId',
    RBACAuth(userRoles.SUPER_ADMIN, userRoles.ADMIN, userRoles.STAFF),
    userValidate,
    users.findUser.bind(users),
  )

  router.get('/me', auth, users.getProfile.bind(users))

  router.patch(
    '/me',
    auth,
    [
      check('name').isString().optional(),
      check('email').isEmail().optional(),
      check('username').optional().isString(),
      check('address').isString().optional(),
      check('phone').isString().optional(),
    ],
    bodyValidate,
    users.updateProfile.bind(users),
  )

  router.patch(
    '/me/avatar',
    auth,
    [check('file.data').isString().notEmpty().escape(), check('file.title').optional().isString().notEmpty().escape()],
    bodyValidate,
    users.updateUserAvatar.bind(users),
  )

  router.delete('/me', auth, users.deleteProfile.bind(users))

  return router
}
