import { _Request, _Response, _NextFunction } from '@/types'
import { validationResult } from 'express-validator'

type ValidationResultError = {
  [string: string]: [string]
}

export default function bodyValidate(req: _Request, res: _Response, next: _NextFunction) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const validationErrors: ValidationResultError = {}
    errors.array().forEach((error) => {
      if (error.type === 'field') {
        // error is FieldValidationError
        validationErrors[error.path] = error.msg
      }
    })
    return res.status(400).json({
      status: 'Bad Request',
      msg: validationErrors,
      payload: null,
    })
  }

  return next()
}
