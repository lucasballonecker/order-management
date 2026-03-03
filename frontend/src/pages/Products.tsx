import { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../services/productService';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { Product } from '../types/product';
import { getErrorMessage } from '../utils/errorHandler';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationResponse<Product> | null>(null);

  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sort: 'name,asc'
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await ProductService.getProducts(params);
      setProducts(response.content);
      setPagination(response);
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Erro ao carregar produtos');
      setError(message);
      console.error('ProductService.getProducts error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {product.id}
                  </span>
                </div>
              </div>
            ))}
          </div>

          
          {pagination && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(params.page! - 1)}
                disabled={params.page === 0 || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Página {pagination.number + 1} de {pagination.totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(params.page! + 1)}
                disabled={params.page! >= pagination.totalPages - 1 || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};