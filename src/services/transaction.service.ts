import { TRANSACTIONS } from "@/global.types"
import TransactionsModel from "@/models/transaction.model"
import httpStatus from "http-status"
import { PaginateResult, PaginateOptions } from "mongoose"
import { ApiError } from "@/middlewares"

class TransactionsService {

    constructor(){
    }

    async getTransactions (page: number, limit: number, type: string | undefined): Promise<PaginateResult<TRANSACTIONS>>  {
        const options: PaginateOptions = {
            page,
            limit,
            populate: [
                {path: 'product_id', populate: 'image_id'},
            ]
        }
    
        const response = await TransactionsModel.paginate({type}, options)

        return response
    }

    async findTransaction (transactionId: string): Promise<TRANSACTIONS>  {
        const transaction = await TransactionsModel.findById(transactionId);
        if(!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, "discount record not found")
        }
        const populateTransaction = await TransactionsModel.populate(transaction, [
            {path: 'product_id', populate: 'image_id'},
        ])

        return populateTransaction
    }

    async createTransaction (product_id: string, quantity_change: number, type: string): Promise<TRANSACTIONS>  {
        const transaction =  new TransactionsModel({
            product_id,
            quantity_change,
            type

        })

        await transaction.save()

        return transaction
    }

    async updateTransaction (transactionId: string, product_id: string, quantity_change: number, type: string): 
    Promise<TRANSACTIONS | null>  {
        const transaction = await TransactionsModel.findById(transactionId);
        if(!transaction) {
            throw new ApiError(httpStatus.NOT_FOUND, "transaction record not found")
        }

        const update = {
           product_id,
           quantity_change,
           type
        }

        const updateTransaction = await TransactionsModel.findOneAndUpdate({_id: transactionId}, update, {new: true})

        return updateTransaction
    }

    async deleteTransaction (transactionId: string): Promise<string>  {
        const transaction = await TransactionsModel.findById(transactionId)

        if(!transaction) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'transaction record not found')
        }

        await TransactionsModel.findOneAndUpdate({_id: transactionId}, {is_delete: true}, {new: true})
        return "discount flagged for delete successfully"
    }
    
    
}

export default TransactionsService