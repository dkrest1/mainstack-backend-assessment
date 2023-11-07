import { _Request, _Response, _NextFunction } from "@/types";
import httpStatus from "http-status";
import UsersService from "@/services/users.service";
import UploadsService from "@/services/upload.service";

class UsersController {
  private usersService: UsersService
  private uploadService: UploadsService

  constructor() { 
    this.usersService = new UsersService()
    this.uploadService = new UploadsService()
  }

  getUser = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const parsePage = Number(req.query.page || 1) as number;
    const parseLimit = Number(req.query.limit || 10) as number;
    const role = req.query.role as string | undefined;
    try {
      const response = await this.usersService.getUser(parsePage, parseLimit, role)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }
  
  findUser = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const userId = req.params.userId
    try {
      const response = await this.usersService.findUser(userId)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  getProfile = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const userId = req.user._id
    try {
      const response = await this.usersService.findUser(userId)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  updateProfile = async (req: _Request, res: _Response, next: _NextFunction) => {
    const updateBody = req.body
    const userId = req.user._id 
    try {
      const response = await this.usersService.updateProfile(userId, updateBody)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  updateUserAvatar = async (req: _Request, res: _Response, next: _NextFunction) => {
    const avatarBody = req.body
    const userId = req.user._id
    try {
      const response = await this.usersService.updateAvatar(userId, avatarBody)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  deleteProfile = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const userId = req.user._id
    try {
      const response = await this.usersService.deleteProfile(userId)

      res.status(200).json({
        status: httpStatus[200],
        msg: response,
        payload: null
      })
    }catch(err) {
      next(err)
    }
  }
  
}

export default UsersController;
