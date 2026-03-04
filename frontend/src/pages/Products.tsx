import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services/productService';
import { OrderService } from '../services/orderService';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { ProductResponse } from '../types/product';
import type { OrderItemRequest } from '../types/order';
import { getErrorMessage } from '../utils/errorHandler';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationResponse<ProductResponse> | null>(null);

  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sort: 'name,asc'
  });

  
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await ProductService.getProducts(params);
      setProducts(response.content);
      setPagination(response);
    } catch (err: unknown) {
      setError('Erro ao carregar produtos');
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

  const addToCart = (productId: number) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const copy = { ...prev };
      const current = copy[productId] || 0;
      if (current <= 1) {
        delete copy[productId];
      } else {
        copy[productId] = current - 1;
      }
      return copy;
    });
  };

  const createOrder = async () => {
    if (Object.keys(cart).length === 0) return;
    setOrderError('');
    setOrderSuccess(false);
    try {
      const items: OrderItemRequest[] = Object.entries(cart).map(
        ([id, qty]) => ({ productId: Number(id), quantity: qty })
      );
      await OrderService.createOrder({ items });
      setOrderSuccess(true);
      setCart({});
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Erro ao criar pedido');
      setOrderError(message);
      console.error('OrderService.createOrder error:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Meus Pedidos
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {Object.keys(cart).length > 0 && (
            <div className="bg-white p-4 rounded mb-6">
              <h3 className="font-semibold mb-2">Carrinho</h3>
              {orderError && <ErrorMessage message={orderError} />}
              {orderSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2">
                  Pedido criado com sucesso!
                </div>
              )}
              <ul>
                {Object.entries(cart).map(([id, qty]) => {
                  const prod = products.find(p => p.id === Number(id));
                  return (
                    <li key={id} className="flex justify-between">
                      <span>{prod?.name || `#${id}`}</span>
                      <span>{qty}x</span>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={createOrder}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Fazer Pedido
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-blue-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {product.id}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    disabled={!cart[product.id]}
                    className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <span>{cart[product.id] || 0}</span>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="px-2 py-1 bg-green-200 rounded"
                  >
                    +
                  </button>
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