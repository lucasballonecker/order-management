import type { OrderResponse } from '../../types/order';

type OrdersTableProps = {
  orders: OrderResponse[];
  onStatusUpdate: (orderId: number, newStatus: string) => Promise<void> | void;
};

const getStatusLabelAndClasses = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return { label: 'Entregue', className: 'bg-green-100 text-green-700' };
    case 'CANCELLED':
      return { label: 'Cancelado', className: 'bg-red-100 text-red-700' };
    case 'CREATED':
      return { label: 'Criado', className: 'bg-slate-100 text-slate-700' };
    case 'PAID':
      return { label: 'Pago', className: 'bg-green-100 text-green-700' };
    case 'SHIPPED':
      return { label: 'Enviado', className: 'bg-blue-100 text-blue-700' };
    default:
      return { label: status, className: 'bg-slate-100 text-slate-700' };
  }
};

export const OrdersTable = ({ orders, onStatusUpdate }: OrdersTableProps) => {
  const renderStatusBadge = (status: string) => {
    const badge = getStatusLabelAndClasses(status);
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}
      >
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {order.userEmail}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(order.status)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  R$ {order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                    className="block w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-colors"
                  >
                    <option value="CREATED">Criado</option>
                    <option value="PAID">Pago</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
