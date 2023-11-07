import { _Request, _Response, _NextFunction } from "@/types";
import httpStatus from "http-status";
import DiscountsService from "@/services/discount.service";

class DiscountsController {
  private discountService: DiscountsService

  constructor() { 
    this.discountService = new DiscountsService()
  }

  createDiscount = async (req: _Request, res: _Response, next: _NextFunction) => {
    const discountBody = req.body
    try {
      const response = await this.discountService.createDiscount(discountBody)

      res.status(200).json({
        status: httpStatus[201],
        msg: "created successfully",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }
  
  getDiscount = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const parsePage = Number(req.query.page || 1) as number;
    const parseLimit = Number(req.query.limit || 10) as number;
    const ParseAmount = Number(req.query.amount) as number | undefined;
    const productId = req.query.product_id as string | undefined;
    const start_date = req.query.start_date as Date | undefined;
    const end_date = req.query.end_date as Date | undefined;
    try {
      const response = await this.discountService.getDiscount(parsePage, parseLimit, ParseAmount, productId, start_date, end_date)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  findDiscount = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const discountId = req.params.discountId
    try {
      const response = await this.discountService.findDiscount(discountId)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  updateDiscount = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const discountId = req.params.productId
    const updateBody = req.body 
    try {
      const response = await this.discountService.updateDiscount(discountId, updateBody)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  deleteDiscount = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const discountId = req.params.discountId
    try {
      const response = await this.discountService.deleteDiscount(discountId)

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

export default DiscountsController;
