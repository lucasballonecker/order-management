import { useState, useEffect } from 'react';
import { OrderService } from '../services/orderService';
import type { OrderResponse } from '../types/order';
import { getErrorMessage } from '../utils/errorHandler';

export const Orders: React.FC = () => {
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
      <h1 className="text-2xl font-bold mb-6">Meus pedidos</h1>

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