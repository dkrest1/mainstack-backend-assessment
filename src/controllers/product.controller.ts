import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import ProductService from "@/services/product.service";

class ProductsController {
  private productService: ProductService

  constructor() { 
    this.productService = new ProductService()
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => { 
    try {
      const response = await this.productService.createProduct()

      res.status(200).json({
        status: httpStatus[200],
        msg: "product created successfully",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }


}

export default ProductsController;
