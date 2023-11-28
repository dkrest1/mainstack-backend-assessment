import { _Request, _Response, _NextFunction } from '@/types'
import ProductModel from '@/models/product.model'
import mongoose from 'mongoose'
import httpStatus from 'http-status'

async function productValidate(req: _Request, res: _Response, next: _NextFunction) {
  const productId = req.params.productId

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      status: httpStatus[400],
      msg: 'invalid product ID',
      payload: null,
    })
  }

  const resp = await ProductModel.find({ _id: productId })
  if (resp.length < 1)
    return res.status(404).json({
      status: httpStatus[404],
      msg: 'product not available',
      payload: null,
    })

  return next()
}

export default productValidate
