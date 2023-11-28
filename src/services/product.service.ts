import httpStatus from 'http-status'
import { PaginateResult, PaginateOptions } from 'mongoose'
import { PRODUCTS } from '@/global.types'
import ProductModel from '@/models/product.model'
import { ApiError } from '@/middlewares'
import UploadsService from './upload.service'
import { UpdateProductRequest, CreateProductRequest } from '@/interfaces/product.interface'

class ProductService {
  private uploadService: UploadsService

  constructor() {
    this.uploadService = new UploadsService()
  }

  async addProduct(createProductRequest: CreateProductRequest): Promise<PRODUCTS> {
    const product = new ProductModel({
      name: createProductRequest.name,
      description: createProductRequest.description,
      sku: createProductRequest.sku,
      price: createProductRequest.price,
      quantity: createProductRequest.quantity,
      supplier: createProductRequest.supplier,
      manufacturer: createProductRequest.manufacturer,
    })
    await product.save()

    //if there is product image to upload
    if (createProductRequest.file) {
      const productImage = await this.uploadService.upload(
        null,
        createProductRequest.file.data!,
        createProductRequest.file.title!,
      )
      product.image_id = productImage
      await product.save()
    }

    return product.populate('supplier manufacturer image_id')
  }

  async getProduct(
    page: number,
    limit: number,
    category: string | undefined,
    price: number | undefined,
  ): Promise<PaginateResult<PRODUCTS>> {
    const options: PaginateOptions = {
      page,
      limit,
      populate: [
        { path: 'manufacturer_id', populate: 'avatar' },
        { path: 'supplier_id', populate: 'avatar' },
        { path: 'image_id' },
      ],
    }

    const options2 = {
      categories: category,
      price,
    }

    Object.keys(options2).forEach((item) => {
      if (!options2[item as keyof typeof options2]) delete options2[item as keyof typeof options2]
    })

    const response = await ProductModel.paginate(options2, options)

    return response
  }

  async findProduct(productId: string): Promise<PRODUCTS> {
    const product = await ProductModel.findById(productId)
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product record not found')
    }
    const populateProduct = await ProductModel.populate(product, [
      { path: 'supplier_id', populate: 'avatar' },
      { path: 'manufacturer_id', populate: 'avatar' },
      { path: 'image_id' },
    ])

    return populateProduct
  }

  async updateProduct(productId: string, updateProductRequest: UpdateProductRequest): Promise<PRODUCTS | null> {
    const product = await ProductModel.findById(productId)
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'product record not found')
    }

    //update the prodcut image if available
    if (updateProductRequest.file) {
      const prodcutImageId = product.image_id?._id
      const updateImage = await this.uploadService.upload(
        prodcutImageId,
        updateProductRequest.file.data!,
        updateProductRequest.file.title!,
      )
      product.image_id = updateImage
      await product.save()
    }

    const update = {
      name: updateProductRequest.name,
      description: updateProductRequest.description,
      sku: updateProductRequest.sku,
      price: updateProductRequest.price,
      quantity: updateProductRequest.quantity,
      categories: updateProductRequest.categories,
      supplier_id: updateProductRequest.supplier,
      manufacturer_id: updateProductRequest.manufacturer,
    }

    const updateProduct = await ProductModel.findOneAndUpdate({ _id: productId }, update, { new: true })

    return updateProduct
  }

  async deleteProduct(productId: string): Promise<string> {
    const product = await ProductModel.findById(productId)

    if (!product) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'product record not found')
    }

    await ProductModel.findOneAndUpdate({ _id: productId }, { is_delete: true }, { new: true })
    return 'product flagged for delete successfully'
  }
}

export default ProductService
