import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { TRANSACTIONS } from '@/global.types'

const TransactionsSchema = new mongoose.Schema<TRANSACTIONS>(
  {
    product_id: {
      type: mongoose.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity_change: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

TransactionsSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.__v
  },
})

TransactionsSchema.plugin(paginate)

const TransactionsModel = mongoose.model<TRANSACTIONS, mongoose.PaginateModel<TRANSACTIONS>>(
  'transactions',
  TransactionsSchema,
)
export default TransactionsModel
