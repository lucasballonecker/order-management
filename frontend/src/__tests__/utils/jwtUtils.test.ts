import { describe, it, expect } from 'vitest';
import { decodeJwt, getEmailFromToken, getRoleFromToken, isTokenExpired } from '../../utils/jwtUtils';


const createTestToken = (payload: Record<string, unknown>): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = Buffer.from('fake-signature').toString('base64');
  return `${header}.${body}.${signature}`;
};

describe('decodeJwt', () => {
  it('deve decodificar um token JWT válido', () => {
    const token = createTestToken({
      sub: 'user@email.com',
      role: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    });

    const result = decodeJwt(token);

    expect(result).not.toBeNull();
    expect(result?.sub).toBe('user@email.com');
    expect(result?.role).toBe('ADMIN');
  });

  it('deve retornar null para token mal formatado', () => {
    const result = decodeJwt('token-invalido');

    expect(result).toBeNull();
  });

  it('deve retornar null para string vazia', () => {
    const result = decodeJwt('');

    expect(result).toBeNull();
  });
});

describe('getEmailFromToken', () => {
  it('deve extrair o email do token', () => {
    const token = createTestToken({
      sub: 'user@email.com',
      role: 'USER',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const email = getEmailFromToken(token);

    expect(email).toBe('user@email.com');
  });

  it('deve retornar null para token inválido', () => {
    const email = getEmailFromToken('invalido');

    expect(email).toBeNull();
  });
});

describe('getRoleFromToken', () => {
  it('deve extrair a role do token', () => {
    const token = createTestToken({
      sub: 'admin@email.com',
      role: 'ADMIN',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const role = getRoleFromToken(token);

    expect(role).toBe('ADMIN');
  });

  it('deve retornar null para token inválido', () => {
    const role = getRoleFromToken('invalido');

    expect(role).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('deve retornar true para token expirado', () => {
    const token = createTestToken({
      sub: 'user@email.com',
      role: 'USER',
      exp: Math.floor(Date.now() / 1000) - 3600, 
    });

    expect(isTokenExpired(token)).toBe(true);
  });

  it('deve retornar false para token válido', () => {
    const token = createTestToken({
      sub: 'user@email.com',
      role: 'USER',
      exp: Math.floor(Date.now() / 1000) + 3600, 
    });

    expect(isTokenExpired(token)).toBe(false);
  });

  it('deve retornar true para token mal formatado', () => {
    expect(isTokenExpired('invalido')).toBe(true);
  });

  it('deve retornar true para token sem exp', () => {
    const token = createTestToken({
      sub: 'user@email.com',
      role: 'USER',
    });

    expect(isTokenExpired(token)).toBe(true);
  });
});

