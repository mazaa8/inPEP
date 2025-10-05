import { apiRequest } from '../config/api';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'PATIENT' | 'CAREGIVER' | 'PROVIDER' | 'INSURER';
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  lastLogin?: string;
}

export const authService = {
  // Register a new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    
    return response;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log('authService.login called with:', data);
    console.log('Stringified data:', JSON.stringify(data));
    
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // Store token in localStorage
    localStorage.setItem('auth_token', response.token);
    
    return response;
  },

  // Get user profile (requires authentication)
  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>('/auth/profile', {
      method: 'GET',
    });
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('auth_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },
};
