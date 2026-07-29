import { createContext } from 'react';
import type { Role } from '../types/user';

export interface AuthUser {
  email: string;
  role: Role;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
