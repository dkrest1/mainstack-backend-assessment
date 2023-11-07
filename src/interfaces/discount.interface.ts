export interface UpdateDiscountRequest {
    product_id?: string;
    amount?: number;
    start_date?: Date;
    end_date?: Date;
}

export interface CreateDiscountRequest {
    product_id: string;
    amount: number;
    start_date: Date;
    end_date: Date;
}