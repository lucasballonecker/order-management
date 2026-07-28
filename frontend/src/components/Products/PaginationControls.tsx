import { Button } from '../ui/Button';

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
      <Button
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0 || loading}
      >
        Anterior
      </Button>

      <span className="text-slate-700 font-medium">
        Página {page + 1} de {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1 || loading}
      >
        Próxima
      </Button>
    </div>
  );
};

