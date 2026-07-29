import type { Role } from '../types/user';

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
  iat: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      sub: decoded.sub,
      role: decoded.role,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch {
    return null;
  }
}

export function getEmailFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.sub || null;
}

export function getRoleFromToken(token: string): Role | null {
  const payload = decodeJwt(token);
  const role = payload?.role;
  if (role === 'USER' || role === 'ADMIN') {
    return role;
  }
  return null;
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();

  return currentTime >= expirationTime;
}
