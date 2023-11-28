import { _Request, _Response, _NextFunction } from '@/types'
import httpStatus from 'http-status'
import OrdersService from '@/services/order.service'

class OrdersController {
  private ordersService: OrdersService

  constructor() {
    this.ordersService = new OrdersService()
  }

  getOrder = async (req: _Request, res: _Response, next: _NextFunction) => {
    const parsePage = Number(req.query.page || 1) as number
    const parseLimit = Number(req.query.limit || 10) as number
    const status = req.query.status as string | undefined
    try {
      const response = await this.ordersService.getOrders(parsePage, parseLimit, status)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  findOrder = async (req: _Request, res: _Response, next: _NextFunction) => {
    const orderId = req.params.orderId
    try {
      const response = await this.ordersService.findOrder(orderId)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  getOrderDetails = async (req: _Request, res: _Response, next: _NextFunction) => {
    const parsePage = Number(req.query.page || 1) as number
    const parseLimit = Number(req.query.limit || 10) as number
    const productId = req.query.product_id as string | undefined
    try {
      const response = await this.ordersService.getOrderDetails(parsePage, parseLimit, productId)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  findOrderDetails = async (req: _Request, res: _Response, next: _NextFunction) => {
    const orderId = req.params.orderId
    try {
      const response = await this.ordersService.findOrderDetails(orderId)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  createOrder = async (req: _Request, res: _Response, next: _NextFunction) => {
    const orderBody = req.body
    try {
      const response = await this.ordersService.createOrder(orderBody)
      res.status(201).json({
        status: httpStatus[201],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  updateOrder = async (req: _Request, res: _Response, next: _NextFunction) => {
    const orderId = req.params.orderId
    const updateBody = req.body
    try {
      const response = await this.ordersService.updateOrder(orderId, updateBody)
      res.status(200).json({
        status: httpStatus[200],
        msg: response,
        payload: null,
      })
    } catch (err) {
      next(err)
    }
  }

  deleteOrder = async (req: _Request, res: _Response, next: _NextFunction) => {
    const orderId = req.params.orderId
    try {
      const response = await this.ordersService.deleteOrder(orderId)
      res.status(200).json({
        status: httpStatus[200],
        msg: response,
        payload: null,
      })
    } catch (err) {
      next(err)
    }
  }
}

export default OrdersController
