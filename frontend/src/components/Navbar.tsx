import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-centralizado">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              {user?.role === 'ADMIN' && (
                <a href="/admin/orders" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Painel de Administração
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {user && (
              <>
                {user.role === 'ADMIN' && (
                  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                    Administrador
                  </span>
              )}

              <button
                onClick={handleLogout}
                className="btn-outline bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
              >
                  Sair
              </button>
                </>
              )}
          </div>
        </div>
      </div>
    </nav>
  );
};