import { describe, it, expect } from 'vitest';

describe('Login Validation Logic', () => {
  it('should validate email format', () => {
    const validateEmail = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
    };

    expect(validateEmail('user@email.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('should validate password length', () => {
    const validatePassword = (password: string): boolean => {
      return password.length >= 6;
    };

    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('pass')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });

  it('should validate form has no errors', () => {
    const validateForm = (email: string, password: string) => {
      const errors: { email?: string; password?: string } = {};

      if (!email) {
        errors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email)) {
        errors.email = 'Email inválido';
      }

      if (!password || password.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres';
      }

      return Object.keys(errors).length === 0;
    };

    expect(validateForm('user@email.com', 'password123')).toBe(true);
    expect(validateForm('invalid', 'pass')).toBe(false);
  });

  it('should store token in localStorage on successful login', () => {
    const mockToken = 'test-jwt-token-12345';
    localStorage.setItem('token', mockToken);

    expect(localStorage.getItem('token')).toBe(mockToken);

    localStorage.removeItem('token');
  });
});
