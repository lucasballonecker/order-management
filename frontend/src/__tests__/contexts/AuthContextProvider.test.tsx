import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import { AuthProvider } from '../../contexts/AuthContextProvider';
import { useAuth } from '../../hooks/useAuth';

const createTestToken = (email: string, role: string, hoursFromNow: number): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    sub: email,
    role,
    exp: Math.floor(Date.now() / 1000) + hoursFromNow * 3600,
    iat: Math.floor(Date.now() / 1000),
  })).toString('base64');
  const signature = Buffer.from('fake-signature').toString('base64');
  return `${header}.${payload}.${signature}`;
};

describe('AuthContextProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar children corretamente', () => {
    render(
      <AuthProvider>
        <div data-testid="child">Filho</div>
      </AuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('deve iniciar com isAuthenticated false quando não há token', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('deve iniciar autenticado quando há token válido no localStorage', () => {
    const token = createTestToken('user@email.com', 'USER', 1);
    localStorage.setItem('authToken', token);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('user@email.com');
    expect(result.current.user?.role).toBe('USER');
  });

  it('deve ignorar token expirado no localStorage', () => {
    const token = createTestToken('user@email.com', 'USER', -1);
    localStorage.setItem('authToken', token);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('deve atualizar estado após login()', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const token = createTestToken('admin@email.com', 'ADMIN', 1);

    act(() => {
      result.current.login(token);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('admin@email.com');
    expect(result.current.user?.role).toBe('ADMIN');
  });

  it('deve persistir token no localStorage após login()', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const token = createTestToken('user@email.com', 'USER', 1);

    act(() => {
      result.current.login(token);
    });

    expect(localStorage.getItem('authToken')).toBe(token);
  });

  it('deve limpar estado após logout()', () => {
    const token = createTestToken('user@email.com', 'USER', 1);
    localStorage.setItem('authToken', token);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('deve remover token inválido do localStorage na inicialização', () => {
    localStorage.setItem('authToken', 'token-invalido');

    renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(localStorage.getItem('authToken')).toBeNull();
  });
});

