import { useNavigate } from 'react-router-dom';

export const EmptyOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-20">
      <p className="text-slate-500 text-lg mb-6">
        Você ainda não fez nenhum pedido.
      </p>
      <button
        onClick={() => navigate('/products')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
      >
        Começar Compras
      </button>
    </div>
  );
};

