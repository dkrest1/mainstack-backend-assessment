import DiscountModel from '@/models/discount.model'
import httpStatus from 'http-status'
import { ApiError } from '@/middlewares'
import { DISCOUNTS } from '@/global.types'
import { PaginateResult, PaginateOptions } from 'mongoose'
import { CreateDiscountRequest, UpdateDiscountRequest } from '@/interfaces/discount.interface'

class DiscountsService {
  constructor() {}

  async getDiscount(
    page: number,
    limit: number,
    amount: number | undefined,
    productId: string | undefined,
    start_date: Date | undefined,
    end_date: Date | undefined,
  ): Promise<PaginateResult<DISCOUNTS>> {
    const options: PaginateOptions = {
      page,
      limit,
      populate: [{ path: 'product_id', populate: 'image_id' }],
    }

    const options2 = {
      amount,
      product_id: productId,
      start_date,
      end_date,
    }

    Object.keys(options2).forEach((item) => {
      if (!options2[item as keyof typeof options2]) delete options2[item as keyof typeof options2]
    })

    const response = await DiscountModel.paginate(options2, options)

    return response
  }

  async findDiscount(discountId: string): Promise<DISCOUNTS> {
    const discount = await DiscountModel.findById(discountId)
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'discount record not found')
    }
    const populateProduct = await DiscountModel.populate(discount, [{ path: 'product_id', populate: 'image_id' }])

    return populateProduct
  }

  async createDiscount(createDiscountRequest: CreateDiscountRequest): Promise<DISCOUNTS> {
    const discount = new DiscountModel({
      product_id: createDiscountRequest.product_id,
      amount: createDiscountRequest.amount,
      start_date: createDiscountRequest.start_date,
      end_date: createDiscountRequest.end_date,
    })

    await discount.save()

    return discount
  }

  async updateDiscount(discountId: string, updateDiscountRequest: UpdateDiscountRequest): Promise<DISCOUNTS | null> {
    const discount = await DiscountModel.findById(discountId)
    if (!discount) {
      throw new ApiError(httpStatus.NOT_FOUND, 'discount record not found')
    }

    const update = {
      amount: updateDiscountRequest.amount,
      product_id: updateDiscountRequest.product_id,
      start_date: updateDiscountRequest.start_date,
      end_date: updateDiscountRequest.end_date,
    }

    const updateDiscount = await DiscountModel.findOneAndUpdate({ _id: discountId }, update, { new: true })

    return updateDiscount
  }

  async deleteDiscount(discountId: string): Promise<string> {
    const discount = await DiscountModel.findById(discountId)

    if (!discount) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'discount record not found')
    }

    await DiscountModel.findOneAndUpdate({ _id: discountId }, { is_delete: true }, { new: true })
    return 'discount flagged for delete successfully'
  }
}

export default DiscountsService
