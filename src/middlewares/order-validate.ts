import { _Request, _Response, _NextFunction } from "@/types";
import OrdersModel from "@/models/order.model";
import mongoose from "mongoose";
import httpStatus from "http-status";

async function orderValidate(req: _Request, res: _Response, next: _NextFunction) {

  const orderId = req.params.orderId;

  if (!(mongoose.Types.ObjectId.isValid(orderId))) {
    return res.status(400).json({ 
      status: httpStatus[400],
      msg: 'invalid order ID',
      payload: null
    })
  }

  const resp = await OrdersModel.find({ _id: orderId });
  if (resp.length < 1) return res.status(404).json({ 
    status: httpStatus[404],
    msg: 'order not found',
    payload: null 
  });

  return next();
}

export default orderValidate;
