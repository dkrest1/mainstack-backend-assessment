import httpStatus from "http-status"
import bcrypt from 'bcrypt';
import { LoginResponse } from "@/interfaces/auth.interface";
import UserModel from "@/models/user.model";
import { ApiError } from "@/middlewares";
import { JwtPayload } from "jsonwebtoken";
import { variables } from "@/config";
import { generateToken } from "@/utils";


class AuthService {

    constructor(){
    }

    async login(email: string, password: string): Promise<LoginResponse>  {
        const user = await UserModel.findOne({email})
        if (!user)  {
            throw new ApiError(httpStatus.BAD_REQUEST, "invalid credentials")
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
          throw new ApiError(httpStatus.BAD_REQUEST, "invalid credentials")
        }

        const payload: JwtPayload = {
            _id: user._id,
            role: user.role
        }

        const access_token = generateToken(payload, variables.JWT_SECRET, variables.JWT_SECRET_EXPIRATION) as string

        const response = {
            user,
            access_token
        }

        return response
    }
}

export default AuthService;