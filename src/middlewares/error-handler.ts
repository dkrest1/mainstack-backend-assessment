import { Request, Response, NextFunction } from 'express'
import { variables, logger } from '@/config'
import httpStatus from 'http-status'
import ApiError from './api-error'

export default function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  const env = variables.NODE_ENV
  let { statusCode, message } = err

  if (env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR
    message = 'server error'
  }

  res.locals['errorMessage'] = err.message

  const response = {
    status: httpStatus[statusCode],
    msg: message,
    payload: null,
  }

  if (env === 'development') logger.error(err)
  res.status(statusCode).send(response)
}
