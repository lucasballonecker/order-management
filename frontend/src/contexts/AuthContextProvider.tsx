import React, { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { getEmailFromToken, getRoleFromToken } from '../utils/jwtUtils';
import { AuthContext, type AuthContextType, type AuthUser } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

const initializeUser = (): AuthUser | null => {
  try {
    
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    const email = getEmailFromToken(token);
    const role = getRoleFromToken(token);
    
    if (email && role) {
      return { email, role };
    }

    localStorage.removeItem('authToken');
    return null;
  } catch (error) {
    console.error('Erro ao inicializar usuário:', error);
    localStorage.removeItem('authToken');
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(initializeUser);

  const login = useCallback((token: string) => {
    try {
      const email = getEmailFromToken(token);
      const role = getRoleFromToken(token);
      
      if (!email || !role) {
        throw new Error('Token inválido: não foi possível extrair email ou role');
      }
      
      localStorage.setItem('authToken', token);
      setUser({ email, role });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};