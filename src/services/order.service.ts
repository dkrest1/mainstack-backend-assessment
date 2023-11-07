import { ORDERS, ORDERS_DETAILS } from "@/global.types";
import OrdersModel from "@/models/order.model";
import OrderDetailsModel from "@/models/order_detail.model";
import httpStatus from "http-status"
import { PaginateResult, PaginateOptions } from "mongoose";
import { ApiError } from "@/middlewares";
import { CreateOrderRequest, UpdateOrderRequest } from "@/interfaces/order.interface";

class OrdersService {

    constructor(){
    }

    async getOrders (page: number, limit: number, status: string | undefined): Promise<PaginateResult<ORDERS>>  {
        const options: PaginateOptions = {
            page,
            limit,
            populate: [
                {path: 'customer_id', populate: 'avatar'},
            ]
        }
    
        const response = await OrdersModel.paginate({status}, options)

        return response
    }

    async getOrderDetails (page: number, limit: number, productId: string | undefined): Promise<PaginateResult<ORDERS_DETAILS>> {
        const options: PaginateOptions = {
            page,
            limit,
            populate: [
                {path: 'product_id', populate: 'image_id'},
                {path: 'order_id'},
            ]
        }
    
        const response = await OrderDetailsModel.paginate({product_id: productId}, options)

        return response
    }

    async findOrder (orderId: string): Promise<ORDERS>  {
        const order = await OrdersModel.findById(orderId);
        if(!order) {
            throw new ApiError(httpStatus.NOT_FOUND, "order record not found")
        }
        const populateOrder = await OrdersModel.populate(order, [
            {path: 'customer_id', populate: 'avatar'},
        ])

        return populateOrder
    }

    async findOrderDetails (orderId: string): Promise<ORDERS_DETAILS> {
        const order_details = await OrderDetailsModel.findOne({order_id: orderId});
        if(!order_details) {
            throw new ApiError(httpStatus.NOT_FOUND, "order details record not found")
        }
        const populateOrderDetails = await OrderDetailsModel.populate(order_details, [
            {path: 'order_id', populate: 'customer_id'},
            {path: 'product_id', populate: 'image_id'},
        ])

        return populateOrderDetails
    }

    async createOrder (createOrderRequest: CreateOrderRequest): Promise<ORDERS_DETAILS>  {

        const order =  new OrdersModel({
            customer_id: createOrderRequest.customer_id,
            total_amount: createOrderRequest.total_amount,
            status: createOrderRequest.status

        })

        await order.save()

        //create the order details
        const order_detail =  new OrderDetailsModel({
            product_id: createOrderRequest.product_id,
            order_id: order._id,
            quantity: createOrderRequest.quantity,
            sub_total: createOrderRequest.sub_total

        })

        await order_detail.save()

        return order_detail.populate("product_id order_id")
    }

    async updateOrder (orderId: string, updateOrderRequest: UpdateOrderRequest): Promise<ORDERS_DETAILS | null>  {
        const order = await OrdersModel.findById(orderId);
        if(!order) {
            throw new ApiError(httpStatus.NOT_FOUND, "order record not found")
        }

        const updateOrder = {
            customer_id: updateOrderRequest.customer_id,
            total_amount: updateOrderRequest.total_amount,
            status: updateOrderRequest.status
        }

        await OrdersModel.findOneAndUpdate({_id: orderId}, updateOrder, {new: true})

        //update order details now

        const updateOrderDetails = {
            product_id: updateOrderRequest.product_id,
            order_id: order._id,
            quantity: updateOrderRequest.quantity,
            sub_total: updateOrderRequest.sub_total

        }

        const updatedOrderDetails =  await OrderDetailsModel.findOneAndUpdate({order_id: orderId}, updateOrderDetails, {new: true})

        return updatedOrderDetails
    }

    async deleteOrder (orderId: string): Promise<string>  {
        const order = await OrdersModel.findById(orderId)

        if(!order) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'order record not found')
        }

        await OrdersModel.updateOne({_id: orderId}, {is_delete: true}, {new: true})
        return "order flagged for delete successfully"
    }
}

export default OrdersService;