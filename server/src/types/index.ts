import { Request } from 'express';

export type UserRole = 'PATIENT' | 'CAREGIVER' | 'PROVIDER' | 'INSURER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}
