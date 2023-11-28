import { _Request, _Response, _NextFunction } from '@/types'
import TransactionsModel from '@/models/transaction.model'
import mongoose from 'mongoose'
import httpStatus from 'http-status'

async function transactionValidate(req: _Request, res: _Response, next: _NextFunction) {
  const transactionId = req.params.transactionId

  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return res.status(400).json({
      status: httpStatus[400],
      msg: 'invalid transaction ID',
      payload: null,
    })
  }

  const resp = await TransactionsModel.find({ _id: transactionId })
  if (resp.length < 1)
    return res.status(404).json({
      status: httpStatus[404],
      msg: 'transaction not found',
      payload: null,
    })

  return next()
}

export default transactionValidate
