import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import type { Role } from '../../types/user';

const mockUseAuth = vi.fn();
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const renderProtectedRoute = ({
  isAuthenticated = false,
  role = 'USER' as Role,
  requiredRole,
}: {
  isAuthenticated?: boolean;
  role?: Role;
  requiredRole?: Role;
} = {}) => {
  mockUseAuth.mockReturnValue({
    user: isAuthenticated ? { email: 'user@email.com', role } : null,
    isAuthenticated,
    logout: vi.fn(),
  });

  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <div data-testid="protected-content">Conteúdo Protegido</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve redirecionar para /login quando usuário não está autenticado', () => {
    renderProtectedRoute({ isAuthenticated: false });

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('deve renderizar children quando usuário está autenticado', () => {
    renderProtectedRoute({ isAuthenticated: true, role: 'USER' });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('deve permitir acesso quando role corresponde à requiredRole', () => {
    renderProtectedRoute({
      isAuthenticated: true,
      role: 'ADMIN',
      requiredRole: 'ADMIN',
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('deve exibir "Acesso Negado" quando role não corresponde', () => {
    renderProtectedRoute({
      isAuthenticated: true,
      role: 'USER',
      requiredRole: 'ADMIN',
    });

    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('deve exibir "Acesso Negado" com botão de logout', () => {
    renderProtectedRoute({
      isAuthenticated: true,
      role: 'USER',
      requiredRole: 'ADMIN',
    });

    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
    expect(screen.getByText('Fazer Login Novamente')).toBeInTheDocument();
  });

  it('deve permitir acesso quando requiredRole não é especificada', () => {
    renderProtectedRoute({
      isAuthenticated: true,
      role: 'USER',
    });

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});

