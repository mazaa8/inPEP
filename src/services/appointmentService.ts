import { apiRequest } from '../config/api';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  title: string;
  description?: string;
  specialty?: string;
  appointmentType?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  duration: number; // minutes
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  notes?: string;
  cancelReason?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateAppointmentData {
  patientId: string;
  patientName?: string;
  providerId: string;
  providerName?: string;
  title: string;
  description?: string;
  specialty?: string;
  appointmentType?: string;
  startTime: string | Date;
  endTime: string | Date;
  duration?: number;
  location?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  title?: string;
  description?: string;
  specialty?: string;
  appointmentType?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  duration?: number;
  location?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  status?: string;
  notes?: string;
}

export const appointmentService = {
  // Get all appointments (filtered by user role on backend)
  getAppointments: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<Appointment[]> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    const endpoint = query ? `/appointments?${query}` : '/appointments';

    return apiRequest<Appointment[]>(endpoint, {
      method: 'GET',
    });
  },

  // Get single appointment by ID
  getAppointmentById: async (id: string): Promise<Appointment> => {
    return apiRequest<Appointment>(`/appointments/${id}`, {
      method: 'GET',
    });
  },

  // Create new appointment
  createAppointment: async (data: CreateAppointmentData): Promise<Appointment> => {
    return apiRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update appointment
  updateAppointment: async (id: string, data: UpdateAppointmentData): Promise<Appointment> => {
    return apiRequest<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Cancel appointment
  cancelAppointment: async (id: string, cancelReason?: string): Promise<Appointment> => {
    return apiRequest<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ cancelReason }),
    });
  },

  // Delete appointment
  deleteAppointment: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },
};
