export interface CreateOrderRequest {
    customer_id: string;
    total_amount: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    product_id: string;
    quantity: number;
    sub_total: number;
}

export interface UpdateOrderRequest {
    customer_id?: string;
    total_amount?: number;
    status?: 'pending' | 'processing' | 'shipped' | 'delivered';
    product_id?: string;
    quantity?: number;
    sub_total?: number;
}