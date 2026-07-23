import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderService } from '../services/orderService';
import type { OrderResponse } from '../types/order';
import { getErrorMessage } from '../utils/errorHandler';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { OrderCard } from '../components/Orders/OrderCard';
import { EmptyOrders } from '../components/Orders/EmptyOrders';

export const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await OrderService.getMyOrders();
        setOrders(res);
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Erro ao carregar pedidos');
        setError(msg);
        console.error('OrderService.getMyOrders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Meus Pedidos</h1>
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Ver Produtos
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-8">
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))
          ) : (
            <EmptyOrders />
          )}
        </div>
      )}
    </div>
  );
};
