import type { ProductResponse } from '../../types/product';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';

interface ShoppingCartProps {
  cart: Record<number, number>;
  products: ProductResponse[];
  orderError: string;
  onCreateOrder: () => void;
}

export const ShoppingCart = ({ cart, products, orderError, onCreateOrder }: ShoppingCartProps) => {
  if (Object.keys(cart).length === 0) return null;

  return (
    <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Carrinho de Compras</h3>
      {orderError && <Alert type="error" message={orderError} />}
      <div className="divide-y divide-slate-200 mb-6">
        {Object.entries(cart).map(([id, qty]) => {
          const product = products.find(p => p.id === Number(id));
          return (
            <div key={id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
              <span className="font-medium text-slate-900">{product?.name || `#${id}`}</span>
              <span className="text-slate-600">{qty}x</span>
            </div>
          );
        })}
      </div>
      <Button onClick={onCreateOrder} className="w-full">
        Finalizar Pedido
      </Button>
    </div>
  );
};

