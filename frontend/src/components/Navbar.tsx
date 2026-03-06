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
        <div className="flex justify-between items-center py-4">
          
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <div className="hidden md:flex space-x-6">
              <a href="/products" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Produtos
              </a>
              <a href="/orders" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Meus Pedidos
              </a>
              {user?.role === 'ADMIN' && (
                <a href="/admin/orders" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Admin
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Olá, {user.email}
                  </span>
                  <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                    {user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                  </span>
                </div>
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