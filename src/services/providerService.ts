import { apiRequest } from '../config/api';

export interface Provider {
  id: string;
  name: string;
  email: string;
  specialty: string;
  department: string;
  licenseNumber?: string;
}

export const providerService = {
  // Get all providers
  getProviders: async (): Promise<Provider[]> => {
    return apiRequest<Provider[]>('/providers', {
      method: 'GET',
    });
  },
};
