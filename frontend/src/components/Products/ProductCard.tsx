import type { ProductResponse } from '../../types/product';

interface ProductCardProps {
  product: ProductResponse;
  quantity: number;
  onAdd: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export const ProductCard = ({ product, quantity, onAdd, onRemove }: ProductCardProps) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md border border-slate-100 rounded-xl p-6 transition-all">
      <h2 className="text-xl font-bold text-slate-900 mb-3">
        {product.name}
      </h2>
      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
        {product.description}
      </p>
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-indigo-600">
          R$ {product.price.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => onRemove(product.id)}
          disabled={!quantity}
          className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          -
        </button>
        <span className="font-medium text-slate-900 min-w-[2rem] text-center">
          {quantity}
        </span>
        <button
          onClick={() => onAdd(product.id)}
          className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
        >
          +
        </button>
      </div>
    </div>
  );
};

