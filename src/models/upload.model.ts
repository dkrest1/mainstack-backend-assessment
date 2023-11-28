import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { UPLOADS } from '@/global.types'

const UploadsSchema = new mongoose.Schema<UPLOADS>(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

UploadsSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v
  },
})

UploadsSchema.plugin(paginate)

const UploadModel = mongoose.model<UPLOADS, mongoose.PaginateModel<UPLOADS>>('uploads', UploadsSchema)
export default UploadModel
