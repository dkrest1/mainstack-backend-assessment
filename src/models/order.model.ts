import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { ORDERS } from "@/global.types";
import OrderDetailsModel from "./order_detail.model";

const OrdersSchema = new mongoose.Schema<ORDERS>({
  customer_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });

OrdersSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
  },
});

//set the is_delete field of the order details that has the ref to the order collection
OrdersSchema.pre("updateOne", { document: true, query: false }, async function (next) {
  try {
    await OrderDetailsModel.findOneAndUpdate({order_id: this._id}, {is_delete: true}, {new: true})
  return next();
  }catch(err: any) {
    return next(err)
  }
 
});

OrdersSchema.plugin(paginate);

const OrdersModel = mongoose.model<ORDERS, mongoose.PaginateModel<ORDERS>>('orders', OrdersSchema);
export default OrdersModel;
