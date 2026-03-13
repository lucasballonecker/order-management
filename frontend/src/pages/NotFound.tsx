import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-4">
            <span className="text-5xl font-bold text-indigo-600">404</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Página Não Encontrada
        </h1>

        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Voltar para Produtos
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium py-3 rounded-lg transition-colors"
          >
            Voltar Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
};
