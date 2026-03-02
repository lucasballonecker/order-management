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
  role: Role;
}

export type Role = 'USER' | 'ADMIN';