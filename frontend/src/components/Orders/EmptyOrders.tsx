import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

export const EmptyOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20">
      <p className="text-slate-500 text-lg mb-6">
        Você ainda não fez nenhum pedido.
      </p>
      <Button onClick={() => navigate('/products')}>
        Começar Compras
      </Button>
    </div>
  );
};

