import { useState, useEffect, useCallback } from 'react';
import { OrderService } from '../services/orderService';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { OrderResponse } from '../types/order';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationResponse<OrderResponse> | null>(null);

  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sort: 'createdAt,desc'
  });

  const [filters, setFilters] = useState({
    status: '',
    userEmail: ''
  });

  const { user } = useAuth();

  const performSearch = useCallback(async (filtersToUse: typeof filters) => {
    if (!user || user.role !== 'ADMIN') return;

    setLoading(true);
    setError('');
    
    try {
      const response = await OrderService.getAllOrders({
        page: 0,
        size: 1000,
        sort: 'createdAt,desc'
      });
      
      let filtered = response.content;
      
      if (filtersToUse.status) {
        filtered = filtered.filter(order => order.status === filtersToUse.status);
      }
      
      if (filtersToUse.userEmail) {
        filtered = filtered.filter(order => 
          order.userEmail.toLowerCase().includes(filtersToUse.userEmail.toLowerCase())
        );
      }
      
      setAllOrders(filtered);
      setParams(prev => ({ ...prev, page: 0 }));
    } catch {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const pageSize = params.size || 10;
    const pageNum = params.page || 0;
    const startIndex = pageNum * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedOrders = allOrders.slice(startIndex, endIndex);
    
    setOrders(paginatedOrders);
    setPagination({
      content: paginatedOrders,
      totalElements: allOrders.length,
      totalPages: Math.ceil(allOrders.length / pageSize),
      number: pageNum,
      size: pageSize
    } as PaginationResponse<OrderResponse>);
  }, [params, allOrders]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      performSearch(filters);
    } catch {
      setError('Erro ao atualizar status');
    }
  };

  const handleSearch = useCallback(() => {
    performSearch(filters);
  }, [filters, performSearch]);

  const handleClearFilters = () => {
    const newFilters = { status: '', userEmail: '' };
    setFilters(newFilters);
    performSearch(newFilters);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filters, handleSearch]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Acesso Negado</h1>
        <p className="text-gray-600">Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-10">Administração de Pedidos</h1>

      {error && <ErrorMessage message={error} />}

      <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-8 mb-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            >
              <option value="">Todos os status</option>
              <option value="CREATED">Criado</option>
              <option value="PAID">Pago</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email do Usuário</label>
            <input
              type="text"
              value={filters.userEmail}
              onChange={(e) => setFilters(prev => ({ ...prev, userEmail: e.target.value }))}
              placeholder="Filter by email"
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded-lg transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Ações</th>
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
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
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

          {pagination && (
            <div className="flex justify-center items-center gap-6">
              <button
                onClick={() => setParams(prev => ({ ...prev, page: Math.max(0, (prev.page || 0) - 1) }))}
                disabled={(params.page || 0) === 0 || loading}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Anterior
              </button>

              <span className="text-slate-700 font-medium">
                Página {(pagination.number || 0) + 1} de {pagination.totalPages}
              </span>

              <button
                onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 0) + 1 }))}
                disabled={(params.page || 0) >= (pagination.totalPages - 1) || loading}
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