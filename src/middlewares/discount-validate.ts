import { _Request, _Response, _NextFunction } from "@/types";
import DiscountModel from "@/models/discount.model";
import mongoose from "mongoose";
import httpStatus from "http-status";

async function discountValidate(req: _Request, res: _Response, next: _NextFunction) {

  const discountId = req.params.discountId;

  if (!(mongoose.Types.ObjectId.isValid(discountId))) {
    return res.status(400).json({ 
      status: httpStatus[400],
      msg: 'invalid discount ID',
      payload: null
    })
  }

  const resp = await DiscountModel.find({ _id: discountId });
  if (resp.length < 1) return res.status(404).json({ 
    status: httpStatus[404],
    msg: 'discount not available',
    payload: null 
  });

  return next();
}

export default discountValidate;
