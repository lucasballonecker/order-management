import api from '../api/api';
import type { CreateOrderRequest, OrderResponse } from '../types/order';

export class OrderService {
  private static readonly BASE_URL = '/orders';

  static async getMyOrders(): Promise<OrderResponse[]> {
    try {
      const response = await api.get(`${this.BASE_URL}/me`);
      return response.data;
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
}