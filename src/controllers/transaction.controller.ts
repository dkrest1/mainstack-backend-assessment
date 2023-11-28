import { _Request, _Response, _NextFunction } from '@/types'
import httpStatus from 'http-status'
import TransactionsService from '@/services/transaction.service'

class TransactionsController {
  private transactionService: TransactionsService

  constructor() {
    this.transactionService = new TransactionsService()
  }

  getTransaction = async (req: _Request, res: _Response, next: _NextFunction) => {
    const parsePage = Number(req.query.page || 1) as number
    const parseLimit = Number(req.query.limit || 10) as number
    const type = req.query.type as string | undefined
    try {
      const response = await this.transactionService.getTransactions(parsePage, parseLimit, type)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  findTransaction = async (req: _Request, res: _Response, next: _NextFunction) => {
    const transactionId = req.params.transactionId
    try {
      const response = await this.transactionService.findTransaction(transactionId)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  createTransaction = async (req: _Request, res: _Response, next: _NextFunction) => {
    const { product_id, quantity_change, type } = req.body
    try {
      const response = await this.transactionService.createTransaction(product_id, quantity_change, type)

      res.status(200).json({
        status: httpStatus[201],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  updateTransaction = async (req: _Request, res: _Response, next: _NextFunction) => {
    const transactionId = req.params.transactionId
    const { product_id, quantity_change, type } = req.body
    try {
      const response = await this.transactionService.updateTransaction(transactionId, product_id, quantity_change, type)

      res.status(200).json({
        status: httpStatus[200],
        msg: 'success',
        payload: response,
      })
    } catch (err) {
      next(err)
    }
  }

  deleteTransaction = async (req: _Request, res: _Response, next: _NextFunction) => {
    const transactionId = req.params.transactionId
    try {
      const response = await this.transactionService.deleteTransaction(transactionId)

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

export default TransactionsController
