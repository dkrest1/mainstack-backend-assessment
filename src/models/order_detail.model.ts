import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { ORDERS_DETAILS } from "@/global.types";

const OrderDetailsSchema = new mongoose.Schema<ORDERS_DETAILS>({
  order_id: {
    type: mongoose.Types.ObjectId,
    ref: "orders",
    required: true
  },
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  sub_total: {
    type: Number,
    required: true
  },
  is_delete: {
    type: Boolean,
    default: false
  } 
}, { timestamps: true });

OrderDetailsSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
  },
});

OrderDetailsSchema.plugin(paginate);

const OrderDetailsModel = mongoose.model<ORDERS_DETAILS, mongoose.PaginateModel<ORDERS_DETAILS>>('order_details', OrderDetailsSchema);
export default OrderDetailsModel;
