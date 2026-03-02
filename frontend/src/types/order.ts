export interface OrderItem {
  productName: string;
  quantity: number;
  priceAtMoment: number;
}

export interface Order {
  id: number;
  userEmail: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export type OrderStatus = 
  | 'CREATED'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
