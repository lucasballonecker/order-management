import type { Dispatch, SetStateAction } from 'react';

export type AdminOrderFilters = {
  status: string;
  userEmail: string;
};

type FiltersPanelProps = {
  filters: AdminOrderFilters;
  setFilters: Dispatch<SetStateAction<AdminOrderFilters>>;
  onSearch: () => void;
  onClear: () => void;
};

export const FiltersPanel = ({
  filters,
  setFilters,
  onSearch,
  onClear,
}: FiltersPanelProps) => {
  return (
    <form
      className="bg-white shadow-sm border border-slate-100 rounded-xl p-8 mb-10"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch();
      }}
    >
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Filtros</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
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
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, userEmail: e.target.value }))
            }
            placeholder="Filter by email"
            className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>

        <div className="flex items-end gap-3">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={onClear}
            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 rounded-lg transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
};

