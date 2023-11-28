import { USERS } from '@/global.types'
import { variables } from '@/config'
import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema<USERS>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: mongoose.Types.ObjectId || null,
      ref: 'uploads',
      default: null,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

UserSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.password
    delete ret.__v
  },
})

UserSchema.pre('save', async function (next) {
  const salt = parseInt(variables.HASH)
  const user: USERS = this
  const hash = await bcrypt.hash(user.password, salt)
  user.password = hash
  return next()
})

UserSchema.plugin(paginate)
const UserModel = mongoose.model<USERS, mongoose.PaginateModel<USERS>>('users', UserSchema)
export default UserModel
