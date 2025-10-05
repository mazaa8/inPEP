import { apiRequest } from '../config/api';

export interface HealthMetric {
  id: string;
  patientId: string;
  metricType: string;
  value: number;
  unit: string;
  additionalData?: string;
  notes?: string;
  recordedBy?: string;
  source: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthInsight {
  id: string;
  patientId: string;
  insightType: 'TREND' | 'RISK' | 'RECOMMENDATION' | 'ACHIEVEMENT';
  category: 'CARDIOVASCULAR' | 'DIABETES' | 'WEIGHT' | 'GENERAL';
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  confidence: number;
  dataPoints?: string;
  isRead: boolean;
  isDismissed: boolean;
  generatedAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddMetricData {
  patientId?: string;
  metricType: string;
  value: number;
  unit: string;
  additionalData?: any;
  notes?: string;
  recordedAt?: string;
}

export const healthService = {
  // Get health metrics
  getMetrics: async (params?: {
    patientId?: string;
    metricType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<HealthMetric[]> => {
    const queryParams = new URLSearchParams();
    if (params?.patientId) queryParams.append('patientId', params.patientId);
    if (params?.metricType) queryParams.append('metricType', params.metricType);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const query = queryParams.toString();
    const endpoint = query ? `/health/metrics?${query}` : '/health/metrics';

    return apiRequest<HealthMetric[]>(endpoint, {
      method: 'GET',
    });
  },

  // Add health metric
  addMetric: async (data: AddMetricData): Promise<HealthMetric> => {
    return apiRequest<HealthMetric>('/health/metrics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Generate AI insights
  generateInsights: async (patientId?: string): Promise<HealthInsight[]> => {
    const endpoint = patientId
      ? `/health/insights/generate/${patientId}`
      : '/health/insights/generate';

    return apiRequest<HealthInsight[]>(endpoint, {
      method: 'POST',
    });
  },

  // Get health insights
  getInsights: async (patientId?: string): Promise<HealthInsight[]> => {
    const query = patientId ? `?patientId=${patientId}` : '';
    return apiRequest<HealthInsight[]>(`/health/insights${query}`, {
      method: 'GET',
    });
  },

  // Mark insight as read
  markInsightRead: async (id: string): Promise<HealthInsight> => {
    return apiRequest<HealthInsight>(`/health/insights/${id}/read`, {
      method: 'PATCH',
    });
  },

  // Dismiss insight
  dismissInsight: async (id: string): Promise<HealthInsight> => {
    return apiRequest<HealthInsight>(`/health/insights/${id}/dismiss`, {
      method: 'PATCH',
    });
  },
};
