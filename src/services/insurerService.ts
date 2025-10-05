import { apiRequest } from '../config/api';

export interface DashboardOverview {
  totalMembers: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  totalClaimedAmount: number;
  totalApprovedAmount: number;
  costSavings: number;
  highRiskPatients: number;
  activeProviders: number;
  averageClaimAmount: number;
}

export interface Claim {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  claimNumber: string;
  claimType: string;
  serviceDate: string;
  submittedDate: string;
  claimedAmount: number;
  approvedAmount?: number;
  deductible: number;
  copay: number;
  status: string;
  denialReason?: string;
  diagnosisCode?: string;
  procedureCode?: string;
  description: string;
  isHighCost: boolean;
  isFraudSuspect: boolean;
  riskScore: number;
  processedDate?: string;
}

export interface RiskAssessment {
  id: string;
  patientId: string;
  patientName: string;
  overallRiskScore: number;
  riskLevel: string;
  chronicConditions?: string;
  recentHospitalizations: number;
  medicationCount: number;
  missedAppointments: number;
  hospitalizationRisk: number;
  costPrediction: number;
  interventions?: string;
  assessmentDate: string;
  nextAssessment?: string;
}

export interface PopulationHealth {
  totalPatients: number;
  patientsTracking: number;
  trackingPercentage: number;
  averageMetrics: {
    bloodPressure?: number;
    glucose?: number;
    weight?: number;
  };
  insightsByCategory: any[];
}

export interface CostAnalytics {
  claimsByType: any[];
  claimsByStatus: any[];
  highCostClaims: Claim[];
  preventiveCareAppointments: number;
  estimatedPreventiveSavings: number;
}

export const insurerService = {
  // Get dashboard overview
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    return apiRequest<DashboardOverview>('/insurer/dashboard/overview', {
      method: 'GET',
    });
  },

  // Get claims
  getClaims: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<Claim[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/insurer/claims?${query}` : '/insurer/claims';

    return apiRequest<Claim[]>(endpoint, {
      method: 'GET',
    });
  },

  // Get risk assessments
  getRiskAssessments: async (params?: {
    riskLevel?: string;
    limit?: number;
  }): Promise<RiskAssessment[]> => {
    const queryParams = new URLSearchParams();
    if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/insurer/risk-assessments?${query}` : '/insurer/risk-assessments';

    return apiRequest<RiskAssessment[]>(endpoint, {
      method: 'GET',
    });
  },

  // Get population health
  getPopulationHealth: async (): Promise<PopulationHealth> => {
    return apiRequest<PopulationHealth>('/insurer/population-health', {
      method: 'GET',
    });
  },

  // Get cost analytics
  getCostAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<CostAnalytics> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const query = queryParams.toString();
    const endpoint = query ? `/insurer/cost-analytics?${query}` : '/insurer/cost-analytics';

    return apiRequest<CostAnalytics>(endpoint, {
      method: 'GET',
    });
  },
};
