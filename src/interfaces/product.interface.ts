export interface CreateProductRequest {
  name: string
  description: string
  sku: string
  price: number
  file?: {
    data?: string
    title?: string
  }
  quantity: number
  categories?: string[]
  manufacturer?: string
  supplier?: string
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  sku?: string
  price: number
  file?: {
    data?: string
    title?: string
  }
  quantity?: number
  categories?: string[]
  manufacturer?: string
  supplier?: string
}
