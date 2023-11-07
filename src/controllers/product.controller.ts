import { _Request, _Response, _NextFunction } from "@/types";
import httpStatus from "http-status";
import ProductService from "@/services/product.service";

class ProductsController {
  private productService: ProductService

  constructor() { 
    this.productService = new ProductService()
  }

  addProduct = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const productBody = req.body

    try {
      const response = await this.productService.addProduct(productBody)

      res.status(200).json({
        status: httpStatus[201],
        msg: "product added successfully",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  getProduct = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const parsePage = Number(req.query.page || 1) as number;
    const parseLimit = Number(req.query.limit || 10) as number;
    const parsePrice = Number(req.query.min_price) as number | undefined;
    const category = req.query.category as string | undefined;

    try {
      const response = await this.productService.getProduct(parsePage, parseLimit, category, parsePrice)
      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  findProduct = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const productId = req.params.productId
    try {
      const response = await this.productService.findProduct(productId)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  updateProduct = async (req: _Request, res: _Response, next: _NextFunction) => {
    const productId = req.params.productId
    const updateBody = req.body
    try {
      const response = await this.productService.updateProduct(productId, updateBody)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  deleteProduct = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const productId = req.params.productId
    try {
      const response = await this.productService.deleteProduct(productId)

      res.status(200).json({
        status: httpStatus[200],
        msg: response,
        payload: null
      })
    }catch(err) {
      next(err)
    }
  }


}
export default ProductsController;
