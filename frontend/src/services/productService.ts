import api from '../api/api';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { Product } from '../types/product';
import { getErrorMessage } from '../utils/errorHandler';

export class ProductService {
  private static readonly BASE_URL = '/products';

  static async getProducts(
    params?: PaginationParams
  ): Promise<PaginationResponse<Product>> {
    try {
      const response = await api.get(this.BASE_URL, {
        params: {
          page: params?.page || 0,
          size: params?.size || 10,
          sort: params?.sort || 'id,asc'
        }
      });
      
      return response.data;
    } catch (error: unknown) {
      console.error('ProductService.getProducts error:', error);
      const message = getErrorMessage(error, 'Erro ao buscar produtos');
      throw new Error(message);
    }
  }

  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`${this.BASE_URL}/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error(`ProductService.getProductById(${id}) error:`, error);
      const message = getErrorMessage(error, 'Erro ao buscar produto');
      throw new Error(message);
    }
  }
}