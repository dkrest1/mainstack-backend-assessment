import { _Request, _Response, _NextFunction } from '@/types'
import ReviewsModel from '@/models/review.model'
import mongoose from 'mongoose'
import httpStatus from 'http-status'

async function reviewValidate(req: _Request, res: _Response, next: _NextFunction) {
  const reviewId = req.params.reviewId

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return res.status(400).json({
      status: httpStatus[400],
      msg: 'invalid review ID',
      payload: null,
    })
  }

  const resp = await ReviewsModel.find({ _id: reviewId })
  if (resp.length < 1)
    return res.status(404).json({
      status: httpStatus[404],
      msg: 'review not found',
      payload: null,
    })

  return next()
}

export default reviewValidate
