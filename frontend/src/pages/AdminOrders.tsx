import { useState, useEffect } from 'react';
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

  const performSearch = async (filtersToUse: typeof filters) => {
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
  };

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

  const handleSearch = () => {
    performSearch(filters);
  };

  const handleClearFilters = () => {
    const newFilters = { status: '', userEmail: '' };
    setFilters(newFilters);
    performSearch(newFilters);
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Acesso Negado</h1>
        <p className="text-gray-600">Apenas administradores podem acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Administração de Pedidos</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Email do Usuário</label>
            <input
              type="text"
              value={filters.userEmail}
              onChange={(e) => setFilters(prev => ({ ...prev, userEmail: e.target.value }))}
              placeholder="Filtrar por email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Buscar
            </button>
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        order.status === 'CREATED' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
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

          
          {pagination && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setParams(prev => ({ ...prev, page: Math.max(0, (prev.page || 0) - 1) }))}
                disabled={(params.page || 0) === 0 || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Página {(pagination.number || 0) + 1} de {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 0) + 1 }))}
                disabled={(params.page || 0) >= (pagination.totalPages - 1) || loading}
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