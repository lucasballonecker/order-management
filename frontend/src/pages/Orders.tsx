import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderService } from '../services/orderService';
import type { OrderResponse } from '../types/order';
import { getErrorMessage } from '../utils/errorHandler';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const Orders: React.FC = () => {
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-6">Meus pedidos</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ver Produtos
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded shadow">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Pedido #{order.id}</span>
                <span className="text-sm text-gray-600">{order.status}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Criado em: {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="font-bold mb-2">Total: R$ {order.total.toFixed(2)}</div>
              <ul className="pl-4 list-disc text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.productName} x {item.quantity} (
                    R$ {item.priceAtMoment.toFixed(2)})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};