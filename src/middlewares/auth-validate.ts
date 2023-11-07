import httpStatus from "http-status";
import { _Request, _Response, _NextFunction } from "@/types";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "@/utils";
import UserModel from "@/models/user.model";
import ApiError from "./api-error";
import { variables } from "@/config";


const auth = async (req: _Request, res: _Response, next: _NextFunction) => {
    let token
    try {
      if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        const payload = verifyToken(token, variables.JWT_SECRET) as JwtPayload;
        const user = await UserModel.findById(payload._id);
        if (!user) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'unauthorized');
        }
        req.user = user;
        next();
      }
    }catch(err) {
      return res.status(401).json({
        success: false,
        message: 'token expired, please log in again'
      })
    }
  
    if (!token) {
      return res.status(401).json({ 
        status: httpStatus[401], 
        msg: "unauthorized, no token found",
        payload: null
      });
    }
}

export default auth;