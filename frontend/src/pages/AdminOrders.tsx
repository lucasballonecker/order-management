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
import { ViewControls } from '../components/AdminOrders/ViewControls';

const applyFilters = (orders: OrderResponse[], filters: AdminOrderFilters) => {
  let filtered = orders;

  if (filters.status) {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  if (filters.userEmail) {
    const normalizedEmail = filters.userEmail.toLowerCase();
    filtered = filtered.filter((order) =>
      order.userEmail.toLowerCase().includes(normalizedEmail)
    );
  }

  return filtered;
};

const paginate = (orders: OrderResponse[], page: number, size: number) => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  const content = orders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(orders.length / size);

  const pagination: PaginationResponse<OrderResponse> = {
    content,
    totalElements: orders.length,
    totalPages,
    number: page,
    size,
    first: page === 0,
    last: page >= totalPages - 1 || totalPages === 0,
    empty: content.length === 0,
  };

  return { pagination };
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
    async (filtersToUse: AdminOrderFilters, sortToUse: string) => {
      if (!user || user.role !== 'ADMIN') return;

      setLoading(true);
      setError('');

      try {
        const response = await OrderService.getAllOrders({
          page: 0,
          size: 1000,
          sort: sortToUse,
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

  const { pagination } = paginate(allOrders, params.page, params.size);

  const handleSortChange = (newSort: string) => {
    setParams((prev) => ({ ...prev, sort: newSort, page: 0 }));
    performSearch(filters, newSort);
  };

  const handleSizeChange = (newSize: number) => {
    setParams((prev) => ({ ...prev, size: newSize, page: 0 }));
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      performSearch(filters, params.sort);
    } catch {
      setError('Erro ao atualizar status');
    }
  };

  const handleSearch = () => {
    performSearch(filters, params.sort);
  };

  const handleClearFilters = () => {
    const newFilters = { status: '', userEmail: '' };
    setFilters(newFilters);
    performSearch(newFilters, params.sort);
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

      <ViewControls
        sort={params.sort}
        size={params.size}
        onSortChange={handleSortChange}
        onSizeChange={handleSizeChange}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-10">
          <OrdersTable
            orders={pagination.content}
            onStatusUpdate={handleStatusUpdate}
          />

          <PaginationBar
            pagination={pagination}
            currentPage={params.page}
            loading={loading}
            setPage={(nextPage: number) => setParams((prev) => ({ ...prev, page: nextPage }))}
          />
        </div>
      )}
    </div>
  );
};

