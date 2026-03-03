export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderItemResponse {
  productName: string;
  quantity: number;
  priceAtMoment: number;
}

export interface CreateOrderRequest {
  items: OrderItemRequest[];
}

export interface OrderResponse {
  id: number;
  userEmail: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItemResponse[];
}