import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderService } from '../services/orderService';
import type { OrderResponse } from '../types/order';
import { getErrorMessage } from '../utils/errorHandler';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

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
              <div key={order.id} className="bg-white shadow-sm border border-slate-100 rounded-xl p-6 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Pedido #{index + 1}</h2>
                    <p className="text-sm text-slate-600">
                      Criado em: {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    order.status === 'CREATED' ? 'bg-slate-100 text-slate-700' :
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {order.status === 'CREATED' ? 'Criado' :
                     order.status === 'PAID' ? 'Pago' :
                     order.status === 'SHIPPED' ? 'Enviado' :
                     order.status === 'DELIVERED' ? 'Entregue' :
                     order.status === 'CANCELLED' ? 'Cancelado' : order.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-6">
                  Total: R$ {order.total.toFixed(2)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Itens do Pedido:</h3>
                  <div className="divide-y divide-slate-200">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                        <span className="font-medium text-slate-900">{item.productName}</span>
                        <div className="text-right">
                          <span className="text-slate-600">{item.quantity}x</span>
                          <span className="ml-4 font-medium text-slate-900">R$ {item.priceAtMoment.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg mb-6">Você ainda não fez nenhum pedido.</p>
              <button
                onClick={() => navigate('/products')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Começar Compras
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};