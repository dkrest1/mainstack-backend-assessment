import { _Request, _Response, _NextFunction } from "@/types";
import { variables } from "@/config";
import { verifyToken } from "@/utils";
import UserModel from "@/models/user.model";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";

const RBACAuth = (...args: string[]) => async (req: _Request, res: _Response, next: _NextFunction) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).json({
                status: httpStatus[401],
                msg: 'unauthorized: missing or invalid authorization header',
            });
        }

        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                status: httpStatus[401], 
                msg: "unauthorized, no token found",
                payload: null
            });
        }
        
        const payload = verifyToken(token, variables.JWT_SECRET) as JwtPayload;
    
        const user = await UserModel.findById(payload._id);

        if (!user) {
            return res.status(401).json({
                status: httpStatus[401],
                msg: "unauthorized",
                payload: null
            });
        }

        const role: string = payload.role;
        if (args.includes(role))  {
            req.user = user;
            //call next to continue to the next middleware or route handler
            next();
        } else {
            return res.status(403).json({
                status: httpStatus[403],
                msg: "access forbidden",
                payload: null
            });
        }
    } catch (err) {
        return res.status(401).json({
            status: httpStatus[401],
            msg: "unauthorized: please login",
            payload: null
        });
    }

};

export default RBACAuth;

