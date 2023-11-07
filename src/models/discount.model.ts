import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { DISCOUNTS } from "@/global.types";

const DiscountsSchema = new mongoose.Schema<DISCOUNTS>({
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  is_delete: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

DiscountsSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
  },
});

DiscountsSchema.plugin(paginate);

const DiscountModel = mongoose.model<DISCOUNTS, mongoose.PaginateModel<DISCOUNTS>>('discounts', DiscountsSchema);
export default DiscountModel;
