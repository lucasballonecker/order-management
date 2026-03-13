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
import { SuccessMessage } from '../components/ui/SuccessMessage';

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

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => setOrderSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess]);

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
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Produtos</h1>
        <button
          onClick={() => navigate('/orders')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Meus Pedidos
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {orderSuccess && (
        <SuccessMessage 
          message="Pedido criado com sucesso!" 
          onDismiss={() => setOrderSuccess(false)}
          autoDissmissMs={5000}
        />
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-10">
          {Object.keys(cart).length > 0 && (
            <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Carrinho de Compras</h3>
              {orderError && <ErrorMessage message={orderError} />}
              <div className="divide-y divide-slate-200 mb-6">
                {Object.entries(cart).map(([id, qty]) => {
                  const prod = products.find(p => p.id === Number(id));
                  return (
                    <div key={id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <span className="font-medium text-slate-900">{prod?.name || `#${id}`}</span>
                      <span className="text-slate-600">{qty}x</span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={createOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Finalizar Pedido
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white shadow-sm hover:shadow-md border border-slate-100 rounded-xl p-6 transition-all">
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  {product.name}
                </h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-indigo-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    disabled={!cart[product.id]}
                    className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    -
                  </button>
                  <span className="font-medium text-slate-900 min-w-[2rem] text-center">{cart[product.id] || 0}</span>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && (
            <div className="flex justify-center items-center gap-6 pt-10">
              <button
                onClick={() => handlePageChange(params.page! - 1)}
                disabled={params.page === 0 || loading}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Anterior
              </button>

              <span className="text-slate-700 font-medium">
                Página {pagination.number + 1} de {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(params.page! + 1)}
                disabled={params.page! >= pagination.totalPages - 1 || loading}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};