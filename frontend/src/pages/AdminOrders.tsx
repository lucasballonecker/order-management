import { useState, useCallback } from 'react';
import { OrderService } from '../services/orderService';
import type { PaginationParams, PaginationResponse } from '../types/pagination';
import type { OrderResponse } from '../types/order';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import type { AdminOrderFilters } from '../components/AdminOrders/FiltersPanel';
import { FiltersPanel } from '../components/AdminOrders/FiltersPanel';
import { OrdersTable } from '../components/AdminOrders/OrdersTable';
import { PaginationBar } from '../components/AdminOrders/PaginationBar';

const applyFilters = (orders: OrderResponse[], filters: AdminOrderFilters) => {
  let filtered = orders;

  if (filters.status) {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  if (filters.userEmail) {
    const temp = filters.userEmail.toLowerCase();
    filtered = filtered.filter((order) =>
      order.userEmail.toLowerCase().includes(temp)
    );
  }

  return filtered;
};

const paginate = (orders: OrderResponse[], page: number, size: number) => {
  const safeSize = size;
  const safePage = page;

  const startIndex = safePage * safeSize;
  const endIndex = startIndex + safeSize;

  const paginatedOrders = orders.slice(startIndex, endIndex);

  const totalPages = Math.ceil(orders.length / safeSize);

  return {
    paginatedOrders,
    pagination: {
      content: paginatedOrders,
      totalElements: orders.length,
      totalPages,
      number: safePage,
      size: safeSize,
    } as PaginationResponse<OrderResponse>,
  };
};

export const AdminOrders = () => {
  const [allOrders, setAllOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [params, setParams] = useState<PaginationParams>({
    page: 0,
    size: 10,
    sort: 'createdAt,desc',
  });

  const [filters, setFilters] = useState<AdminOrderFilters>({
    status: '',
    userEmail: '',
  });

  const { user } = useAuth();

  const performSearch = useCallback(
    async (filtersToUse: AdminOrderFilters) => {
      if (!user || user.role !== 'ADMIN') return;

      setLoading(true);
      setError('');

      try {
        const response = await OrderService.getAllOrders({
          page: 0,
          size: 1000,
          sort: 'createdAt,desc',
        });

        const filtered = applyFilters(response.content, filtersToUse);

        setAllOrders(filtered);
        setParams((prev) => ({ ...prev, page: 0 }));
      } catch {
        setError('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const paginated = paginate(allOrders, params.page ?? 0, params.size ?? 10);



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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Acesso Negado
        </h1>
        <p className="text-gray-600">
          Apenas administradores podem acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-10">
        Administração de Pedidos
      </h1>

      {error && <ErrorMessage message={error} />}

      <FiltersPanel
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-10">
          <OrdersTable
            orders={paginated.paginatedOrders}
            onStatusUpdate={handleStatusUpdate}
          />

          <PaginationBar
            pagination={paginated.pagination}
            currentPage={params.page ?? 0}
            loading={loading}
            setPage={(nextPage: number) => setParams((prev) => ({ ...prev, page: nextPage }))}
          />
        </div>
      )}
    </div>
  );
};
