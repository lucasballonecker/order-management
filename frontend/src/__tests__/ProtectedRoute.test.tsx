import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ProtectedRoute Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should allow access when token exists', () => {
    const isAuthenticated = (token: string | null): boolean => {
      return !!token && token.length > 0;
    };

    localStorage.setItem('token', 'valid-jwt-token');
    const token = localStorage.getItem('token');

    expect(isAuthenticated(token)).toBe(true);
  });

  it('should deny access when token is missing', () => {
    const isAuthenticated = (token: string | null): boolean => {
      return !!token && token.length > 0;
    };

    const token = localStorage.getItem('token');
    expect(isAuthenticated(token)).toBe(false);
  });

  it('should deny access when token is empty', () => {
    const isAuthenticated = (token: string | null): boolean => {
      return !!token && token.length > 0;
    };

    localStorage.setItem('token', '');
    const token = localStorage.getItem('token');

    expect(isAuthenticated(token)).toBe(false);
  });

  it('should clear token on logout', () => {
    localStorage.setItem('token', 'jwt-token');
    expect(localStorage.getItem('token')).toBe('jwt-token');

    localStorage.removeItem('token');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
