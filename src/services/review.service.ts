import { REVIEWS } from "@/global.types";
import ReviewsModel from "@/models/review.model";
import httpStatus from "http-status"
import { ApiError } from "@/middlewares";
import { PaginateResult,PaginateOptions } from "mongoose";

class ReviewsService {

    constructor(){
    }

    async getReview (page: number, limit: number, rating: number | undefined, product_id: string | undefined, customer_id: string | undefined): Promise<PaginateResult<REVIEWS>>  {
        const options: PaginateOptions = {
            page,
            limit,
            populate: [
                {path: 'product_id', populate: 'image_id'},
                {path: 'customer_id', populate: 'avatar'},
            ]
        }

        const options2 = {
            rating,
            product_id,
            customer_id
          };
        
         
        Object.keys(options2).forEach((item) => {
            if (!options2[item as keyof typeof options2]) delete options2[item as keyof typeof options2]
            });
    
        const response = await ReviewsModel.paginate(options2, options)

        return response
    }

    async findReview (reviewId: string): Promise<REVIEWS>  {
        const review = await ReviewsModel.findById(reviewId);
        if(!review) {
            throw new ApiError(httpStatus.NOT_FOUND, "review record not found")
        }
        const populateReview = await ReviewsModel.populate(review, [
            {path: 'customer_id', populate: 'avatar'},
            {path: 'product_id', populate: 'image_id'},
        ])

        return populateReview
    }

    async addReview (customer_id: string, product_id: string, rating: number, text: string): Promise<REVIEWS>  {
        const review =  new ReviewsModel({
            customer_id,
            product_id,
            rating,
            text
        })

        await review.save()

        return review
    }

    async deleteReview (reviewId: string): Promise<string>  {
        const review = await ReviewsModel.findById(reviewId)

        if(!review) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'review record not found')
        }

        await ReviewsModel.deleteOne({_id: reviewId})
        return "review deleted successfully"
    }
}

export default ReviewsService;