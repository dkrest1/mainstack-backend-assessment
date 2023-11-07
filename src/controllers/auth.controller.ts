import { _Request, _Response, _NextFunction } from "@/types";
import httpStatus from "http-status";
import UsersService from "@/services/users.service";
import AuthService from "@/services/auth.service";

class authController {
  private usersService: UsersService
  private authService: AuthService

  constructor() { 
    this.usersService = new UsersService()
    this.authService = new AuthService()
  }

 

  login = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const {email, password} = req.body
    try {
      const response = await this.authService.login(email, password)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  createUser = async (req: _Request, res: _Response, next: _NextFunction) => {
    const userBody = req.body 
    try {
      const response = await this.usersService.createUser(userBody)

      res.status(201).json({
        status: httpStatus[201],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

}

export default authController;
