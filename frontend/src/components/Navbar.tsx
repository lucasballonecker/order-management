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
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-800">
              Order Management
            </h1>
            <div className="hidden md:flex space-x-6">
              <a href="/products" className="text-gray-600 hover:text-gray-800">
                Produtos
              </a>
              <a href="/orders" className="text-gray-600 hover:text-gray-800">
                Pedidos
              </a>
            </div>
          </div>

          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  Olá, {user.email}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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