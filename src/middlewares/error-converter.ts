import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import ApiError from './api-error'
import mongoose from 'mongoose'

export default function errorConverter(err: any, _req: Request, _res: Response, next: NextFunction) {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR
    const message: string = error.message || `${httpStatus[statusCode]}`
    error = new ApiError(statusCode, message, false, err.stack)
  }

  next(error)
}
