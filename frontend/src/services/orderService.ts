import api from '../api/api';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { CreateOrderRequest, OrderResponse } from '../types/order';

export class OrderService {
  private static readonly BASE_URL = '/orders';

  static async getMyOrders(): Promise<OrderResponse[]> {
    try {
      const response = await api.get(`${this.BASE_URL}/me`);
      
      return response.data?.content || [];
    } catch {
      throw new Error('Erro ao buscar pedidos');
    }
  }

  static async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const response = await api.post(this.BASE_URL, request);
      return response.data;
    } catch {
      throw new Error('Erro ao criar pedido');
    }
  }

  static async getAllOrders(
    params?: PaginationParams
  ): Promise<PaginationResponse<OrderResponse>> {
    try {
      const response = await api.get('/orders', {
        params: {
          page: params?.page || 0,
          size: params?.size || 10,
          sort: params?.sort || 'createdAt,desc'
        }
      });
      return response.data;
    } catch {
      throw new Error('Erro ao buscar pedidos');
    }
  }

  static async updateOrderStatus(orderId: number, status: string): Promise<OrderResponse> {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch {
      throw new Error('Erro ao atualizar status do pedido');
    }
  }
}