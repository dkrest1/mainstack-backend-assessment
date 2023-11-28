type USER_ROLE = 'super_admin' | 'admin' | 'staff' | 'supplier' | 'manufacturer' | 'customer'

type ORDER_STATUS = 'pending' | 'processing' | 'shipped' | 'delivered'

type TRANSACTION_TYPE = 'purchase' | 'sale' | 'return' | 'transfer' | 'adjustment' | 'damage' | 'loss' | 'other'

export type UPLOADS = {
  _id: string
  title: string
  url: string
  createdAt: string
  updatedAt: string
}

export type USERS = {
  _id: string
  name: string
  email: string
  username: string
  address: string
  avatar: UPLOADS | null
  phone: string
  password: string
  role: USER_ROLE
  createdAt: string
  updatedAt: string
}

export type PRODUCTS = {
  _id: string
  name: string
  description: string
  categories: string[]
  sku: string
  manufacturer_id: USERS | null
  supplier_id: USERS | null
  price: number
  quantity: number
  image_id: UPLOADS | null
  is_delete: boolean
  createdAt: string
  updatedAt: string
}

export type ORDERS = {
  _id: string
  customer_id: USERS
  total_amount: number
  status: ORDER_STATUS
  is_delete: boolean
  createdAt: string
  updatedAt: string
}

export type ORDERS_DETAILS = {
  _id: string
  order_id: ORDERS
  product_id: PRODUCTS
  quantity: number
  sub_total: number
  is_delete: boolean
  createdAt: string
  updatedAt: string
}

export type TRANSACTIONS = {
  _id: string
  product_id: PRODUCTS
  quantity_change: number
  type: TRANSACTION_TYPE
  is_delete: boolean
  createdAt: string
  updatedAt: string
}

export type DISCOUNTS = {
  _id: string
  product_id: PRODUCTS
  amount: number
  start_date: Date
  end_date: Date
  is_delete: boolean
  createdAt: string
  updatedAt: string
}

export type REVIEWS = {
  _id: string
  product_id: PRODUCTS
  customer_id: USERS
  rating: number
  text: string
  createdAt: string
  updatedAt: string
}
