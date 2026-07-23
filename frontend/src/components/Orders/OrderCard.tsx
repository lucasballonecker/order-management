import type { OrderResponse } from '../../types/order';

interface OrderCardProps {
  order: OrderResponse;
  index: number;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  CREATED: { label: 'Criado', className: 'bg-slate-100 text-slate-700' },
  PAID: { label: 'Pago', className: 'bg-green-100 text-green-700' },
  SHIPPED: { label: 'Enviado', className: 'bg-blue-100 text-blue-700' },
  DELIVERED: { label: 'Entregue', className: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
};

export const OrderCard = ({ order, index }: OrderCardProps) => {
  const statusConfig = STATUS_CONFIG[order.status];
  const statusClass = statusConfig?.className ?? 'bg-slate-100 text-slate-700';
  const statusLabel = statusConfig?.label ?? order.status;

  return (
    <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-6 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Pedido #{index + 1}</h2>
          <p className="text-sm text-slate-600">
            Criado em: {new Date(order.createdAt).toLocaleString('pt-BR')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
          {statusLabel}
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
                <span className="ml-4 font-medium text-slate-900">
                  R$ {item.priceAtMoment.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

