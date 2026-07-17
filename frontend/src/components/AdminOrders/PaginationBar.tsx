import type { PaginationResponse } from '../../types/pagination';

type PaginationBarProps = {
  pagination: PaginationResponse<unknown>;
  currentPage: number;
  loading: boolean;
  setPage: (nextPage: number) => void;
};

export const PaginationBar = ({
  pagination,
  currentPage,
  loading,
  setPage,
}: PaginationBarProps) => {
  if (!pagination || pagination.totalPages <= 0) return null;

  return (
    <div className="flex justify-center items-center gap-6">
      <button
        onClick={() => setPage(Math.max(0, currentPage - 1))}
        disabled={ currentPage === 0 || loading}
        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Anterior
      </button>

      <span className="text-slate-700 font-medium">
        Página {(pagination.number) + 1} de {pagination.totalPages}
      </span>

      <button
        onClick={() => setPage( currentPage + 1)}
        disabled={ currentPage >= pagination.totalPages - 1 || loading}
        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Próxima
      </button>
    </div>
  );
};

