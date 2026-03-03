import api from '../api/api';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { ProductResponse } from '../types/product';

export class ProductService {
  private static readonly BASE_URL = '/products';

  static async getProducts(
    params?: PaginationParams
  ): Promise<PaginationResponse<ProductResponse>> {
    try {
      const response = await api.get(this.BASE_URL, {
        params: {
          page: params?.page || 0,
          size: params?.size || 10,
          sort: params?.sort || 'id,asc'
        }
      });
      
      return response.data;
    } catch {
      throw new Error('Erro ao buscar produtos');
    }
  }

  static async getProductById(id: string): Promise<ProductResponse> {
    try {
      const response = await api.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch {
      throw new Error('Erro ao buscar produto');
    }
  }
}