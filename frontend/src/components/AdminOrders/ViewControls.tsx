type ViewControlsProps = {
  sort: string;
  size: number;
  onSortChange: (sort: string) => void;
  onSizeChange: (size: number) => void;
};

export const ViewControls = ({
  sort,
  size,
  onSortChange,
  onSizeChange,
}: ViewControlsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">
          Ordenar por:
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="createdAt,desc">Data (mais recente)</option>
          <option value="createdAt,asc">Data (mais antigo)</option>
          <option value="total,desc">Valor (maior)</option>
          <option value="total,asc">Valor (menor)</option>
          <option value="status,asc">Status (A-Z)</option>
          <option value="status,desc">Status (Z-A)</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700">
          Itens por página:
        </label>
        <select
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

