import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2';
import { PRODUCTS } from "@/global.types";

const ProductSchema = new mongoose.Schema<PRODUCTS>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  manufacturer_id: {
    type: mongoose.Types.ObjectId || null,
    ref: "users"
  },
  supplier_id: {
    type: mongoose.Types.ObjectId || null,
    ref: "users"
  },
  price: {
    type: Number,
    required: true
  },
  image_id: {
    type: mongoose.Types.ObjectId || null,
    ref: "uploads",
    default: null
  },
  categories: [{
    type: String,
  }],
  quantity: {
    type: Number,
    required: true
  },
  is_delete: {
    type: Boolean,
    default: false
  } 
}, { timestamps: true });

ProductSchema.set("toJSON", {
  transform(_doc, ret) {
    delete ret.__v;
  },
});

ProductSchema.plugin(paginate);

const ProductModel = mongoose.model<PRODUCTS, mongoose.PaginateModel<PRODUCTS>>('products', ProductSchema);
export default ProductModel;
