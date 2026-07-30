export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export type Role = 'USER' | 'ADMIN';