import { apiRequest } from '../config/api';

export interface Provider {
  id: string;
  name: string;
  email: string;
  specialty: string;
  department: string;
  licenseNumber?: string;
}

export interface PatientOverviewMetrics {
  activePatients: number;
  riskAlerts: {
    high: number;
    medium: number;
    low: number;
  };
  readmissionRisk: {
    highRisk: number;
    total: number;
  };
  caregiverEngagement: {
    highlyEngaged: number;
    moderatelyEngaged: number;
    lowEngagement: number;
  };
}

export const providerService = {
  // Get all providers
  getProviders: async (): Promise<Provider[]> => {
    return apiRequest<Provider[]>('/providers', {
      method: 'GET',
    });
  },

  // Get patient overview metrics for provider dashboard
  getPatientOverviewMetrics: async (providerId: string): Promise<PatientOverviewMetrics> => {
    return apiRequest<PatientOverviewMetrics>(`/providers/${providerId}/overview`, {
      method: 'GET',
    });
  },
};
