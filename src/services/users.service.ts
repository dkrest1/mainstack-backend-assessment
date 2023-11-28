import { USERS } from '@/global.types'
import httpStatus from 'http-status'
import UserModel from '@/models/user.model'
import { ApiError } from '@/middlewares'
import { PaginateResult, PaginateOptions } from 'mongoose'
import { UpdateUserRequest, FileData } from '@/interfaces/user-interface'
import UploadsService from './upload.service'

class UsersService {
  private uploadService: UploadsService

  constructor() {
    this.uploadService = new UploadsService()
  }

  async createUser(createUserBody: USERS): Promise<USERS> {
    const existingEmail = await UserModel.findOne({ email: createUserBody.email })

    const existingUsername = await UserModel.findOne({ username: createUserBody.username })

    if (existingEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'email already registered')
    }

    if (existingUsername) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'username already exist, please choose another username')
    }

    const user = new UserModel()
    user.name = createUserBody.name
    user.email = createUserBody.email
    user.username = createUserBody.username
    user.password = createUserBody.password
    user.address = createUserBody.address
    user.phone = createUserBody.phone
    user.role = createUserBody.role

    await user.save()

    return user
  }

  async getUser(page: number, limit: number, role: string | undefined): Promise<PaginateResult<USERS>> {
    const options: PaginateOptions = {
      page,
      limit,
      populate: [{ path: 'avatar' }],
    }

    const response = await UserModel.paginate({ role }, options)

    return response
  }

  async findUser(userId: String): Promise<USERS> {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user record not found')
    }
    const populateUser = await UserModel.populate(user, [{ path: 'avatar' }])

    return populateUser
  }

  async updateProfile(userId: string, updateUserRequest: UpdateUserRequest): Promise<USERS | null> {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user record not found')
    }

    const update = {
      name: updateUserRequest.name,
      email: updateUserRequest.email,
      username: updateUserRequest.username,
      address: updateUserRequest.address,
      phone: updateUserRequest.phone,
    }

    const updateUser = await UserModel.findOneAndUpdate({ _id: userId }, update, { new: true })

    return updateUser
  }

  async updateAvatar(userId: string, fileData: FileData): Promise<USERS> {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user record not found')
    }

    const updateAvatar = await this.uploadService.upload(null, fileData.data, fileData.title)
    user.avatar = updateAvatar
    await user.save()
    return user
  }

  async deleteProfile(userId: string): Promise<string> {
    const user = await UserModel.findById(userId)

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user record not found')
    }

    await UserModel.deleteOne({ _id: userId })
    return 'deleted successfully'
  }
}

export default UsersService
