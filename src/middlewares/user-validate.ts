import { _Request, _Response, _NextFunction } from "@/types";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import httpStatus from "http-status";

async function userValidate(req: _Request, res: _Response, next: _NextFunction) {

  const userId = req.params.userId;

  if (!(mongoose.Types.ObjectId.isValid(userId))) {
    return res.status(400).json({ 
      status: httpStatus[400],
      msg: 'invalid user ID',
      payload: null
    })
  }

  const resp = await UserModel.find({ _id: userId });
  if (resp.length < 1) return res.status(404).json({ 
    status: httpStatus[404],
    msg: 'user not found',
    payload: null 
  });

  return next();
}

export default userValidate;
