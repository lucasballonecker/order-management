interface PaginationControlsProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (newPage: number) => void;
}

export const PaginationControls = ({ page, totalPages, loading, onPageChange }: PaginationControlsProps) => {
  if (totalPages <= 0) return null;

  return (
    <div className="flex justify-center items-center gap-6 pt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0 || loading}
        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Anterior
      </button>

      <span className="text-slate-700 font-medium">
        Página {page + 1} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1 || loading}
        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Próxima
      </button>
    </div>
  );
};

