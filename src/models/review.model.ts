import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { REVIEWS } from "@/global.types";

const ReviewsSchema = new mongoose.Schema<REVIEWS>({
  product_id: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true
  },
  customer_id: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },
  rating: {
    type: Number,
    default: 4,
    max: 5,
    min: 1
  },
  text: {
    type: String
  }
}, { timestamps: true });

ReviewsSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
  },
});

ReviewsSchema.plugin(paginate);

const ReviewsModel = mongoose.model<REVIEWS, mongoose.PaginateModel<REVIEWS>>('reviews', ReviewsSchema);
export default ReviewsModel;
