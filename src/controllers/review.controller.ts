import { _Request, _Response, _NextFunction } from "@/types";
import httpStatus from "http-status";
import ReviewsService from "@/services/review.service";

class ReviewController {
  private reviewService: ReviewsService

  constructor() { 
    this.reviewService = new ReviewsService()
  }

  getReview = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const parsePage = Number(req.query.page || 1) as number;
    const parseLimit = Number(req.query.limit || 10) as number;
    const parseRating = Number(req.query.rating) as number | undefined;
    const productId = req.query.product_id as string | undefined;
    const customerId = req.query.customer_id as string | undefined;
    try {
      const response = await this.reviewService.getReview(parsePage, parseLimit, parseRating, productId, customerId)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }
  
  findReview = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const reviewId = req.params.reviewId
    try {
      const response = await this.reviewService.findReview(reviewId)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  addReview = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const {customer_id, product_id, rating, text} = req.body
    try {
      const response = await this.reviewService.addReview(customer_id, product_id, rating, text)

      res.status(200).json({
        status: httpStatus[200],
        msg: "success",
        payload: response
      })
    }catch(err) {
      next(err)
    }
  }

  deleteReview = async (req: _Request, res: _Response, next: _NextFunction) => { 
    const reviewId = req.params.reviewId
    try {
      const response = await this.reviewService.deleteReview(reviewId)

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

export default ReviewController;
