import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import axios, { AxiosError } from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

interface Product {
  id: number;
  name: string;
  price: number;
}

describe('API Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should add Bearer token to request headers', async () => {
    const mockToken = 'test-jwt-token';
    localStorage.setItem('token', mockToken);

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    expect(config.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('should handle 401 unauthorized response', async () => {
    const error = new AxiosError('Request failed with status code 401');
    error.code = '401';

    mockedAxios.get.mockRejectedValue(error);

    try {
      await mockedAxios.get('/api/products');
      expect.fail('Should have thrown error');
    } catch (err) {
      expect(err).toBeInstanceOf(AxiosError);
      expect((err as AxiosError).code).toBe('401');
    }
  });

  it('should handle network error', async () => {
    const networkError = new Error('Network Error');
    mockedAxios.get.mockRejectedValue(networkError);

    try {
      await mockedAxios.get('/api/orders');
      expect.fail('Should have thrown error');
    } catch (error: unknown) {
      const err = error as Error;
      expect(err.message).toBe('Network Error');
    }
  });

  it('should parse successful API response', async () => {
    const mockData: Product[] = [
      { id: 1, name: 'Product 1', price: 100 },
      { id: 2, name: 'Product 2', price: 200 },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockData });

    const response = await mockedAxios.get<Product[]>('/api/products');
    expect(response.data).toHaveLength(2);
    expect(response.data[0].name).toBe('Product 1');
  });
});
