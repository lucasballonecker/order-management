import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-10">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 mb-4">
            <span className="text-5xl font-bold text-primary-600">404</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Página Não Encontrada
        </h1>

        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Desculpe, a página que você está procurando não existe ou foi removida.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate('/products')} className="w-full">
            Voltar para Produtos
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
            Voltar Página Anterior
          </Button>
        </div>
      </div>
    </div>
  );
};
