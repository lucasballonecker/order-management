import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import type { Role } from '../types';
import { Button } from './ui/Button';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

export const ProtectedRoute = ({
  children,
  requiredRole
}: ProtectedRouteProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-md">
        <div className="bg-white shadow-sm border border-red-200 rounded-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-slate-600 mb-8">
            Você não tem permissão para acessar esta página. Apenas administradores podem acessar.
          </p>
          <Button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full"
          >
            Fazer Login Novamente
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};