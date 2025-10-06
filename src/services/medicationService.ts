import api from '../config/api';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  ndc?: string;
  dosage: string;
  form: string;
  manufacturer?: string;
  category?: string;
  description?: string;
  sideEffects?: string;
  warnings?: string;
  instructions?: string;
  requiresPrescription: boolean;
  controlledSubstance?: string;
  averagePrice?: number;
  insuranceCovered: boolean;
  alternatives?: MedicationAlternative[];
  interactions?: DrugInteraction[];
}

export interface MedicationAlternative {
  id: string;
  medicationId: string;
  alternativeId: string;
  alternative: Medication;
  type: string;
  costDifference?: number;
  effectiveness?: string;
  approvedBy?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  providerId: string;
  medicationId: string;
  medication: Medication;
  dosage: string;
  frequency: string;
  duration?: number;
  quantity: number;
  startDate: string;
  endDate?: string;
  refillsAllowed: number;
  refillsRemaining: number;
  status: string;
  instructions?: string;
  notes?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  pharmacyAddress?: string;
}

export interface MedicationStock {
  id: string;
  patientId: string;
  medicationId: string;
  medication: Medication;
  prescriptionId?: string;
  prescription?: Prescription;
  currentStock: number;
  lowStockThreshold: number;
  lastRefillDate?: string;
  nextRefillDue?: string;
  autoRefill: boolean;
  pharmacyName?: string;
  pharmacyPhone?: string;
  pharmacyAddress?: string;
}

export interface DrugInteraction {
  id: string;
  medication1Id: string;
  medication1: Medication;
  medication2Id: string;
  medication2: Medication;
  severity: string;
  description: string;
  recommendation?: string;
  source?: string;
}

export interface MedicationHistory {
  id: string;
  patientId: string;
  medicationId: string;
  medication: Medication;
  action: string;
  timestamp: string;
  dosageTaken?: string;
  notes?: string;
  recordedBy?: string;
}

export interface RefillRequest {
  id: string;
  prescriptionId: string;
  prescription: Prescription;
  requestedBy: string;
  requestedAt: string;
  status: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  approvedBy?: string;
  approvedAt?: string;
  filledAt?: string;
  notes?: string;
}

export interface AdherenceData {
  adherenceRate: number;
  taken: number;
  missed: number;
  total: number;
}

class MedicationService {
  // Medications
  async getMedications(search?: string, category?: string): Promise<Medication[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const response = await api.get(`/medications?${params.toString()}`);
    return response.data;
  }

  async getMedicationById(id: string): Promise<Medication> {
    const response = await api.get(`/medications/${id}`);
    return response.data;
  }

  async getMedicationAlternatives(id: string): Promise<MedicationAlternative[]> {
    const response = await api.get(`/medications/${id}/alternatives`);
    return response.data;
  }

  async checkDrugInteractions(medicationIds: string[]): Promise<DrugInteraction[]> {
    const response = await api.post('/medications/check-interactions', { medicationIds });
    return response.data;
  }

  async searchByBarcode(ndc: string): Promise<Medication> {
    const response = await api.get(`/medications/barcode/${ndc}`);
    return response.data;
  }

  // Prescriptions
  async getPatientPrescriptions(patientId: string, status?: string): Promise<Prescription[]> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/prescriptions/patient/${patientId}${params}`);
    return response.data;
  }

  async getPrescriptionById(id: string): Promise<Prescription> {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  }

  async createPrescription(data: any): Promise<Prescription> {
    const response = await api.post('/prescriptions', data);
    return response.data;
  }

  async requestRefill(prescriptionId: string, data: any): Promise<RefillRequest> {
    const response = await api.post(`/prescriptions/${prescriptionId}/refill`, data);
    return response.data;
  }

  async approveRefill(refillId: string): Promise<RefillRequest> {
    const response = await api.patch(`/prescriptions/refill/${refillId}/approve`);
    return response.data;
  }

  async markRefillFilled(refillId: string, quantity: number): Promise<RefillRequest> {
    const response = await api.patch(`/prescriptions/refill/${refillId}/filled`, { quantity });
    return response.data;
  }

  // Stock Management
  async getPatientStock(patientId: string): Promise<MedicationStock[]> {
    const response = await api.get(`/medication-stock/patient/${patientId}`);
    return response.data;
  }

  async getLowStockAlerts(patientId: string): Promise<MedicationStock[]> {
    const response = await api.get(`/medication-stock/patient/${patientId}/low-stock`);
    return response.data;
  }

  async updateStock(stockId: string, change: number, action?: string, notes?: string): Promise<MedicationStock> {
    const response = await api.post('/medication-stock/update', {
      stockId,
      change,
      action,
      notes,
    });
    return response.data;
  }

  async logDoseTaken(patientId: string, medicationId: string, dosageTaken: string, notes?: string): Promise<MedicationHistory> {
    const response = await api.post('/medication-stock/log-dose', {
      patientId,
      medicationId,
      dosageTaken,
      notes,
    });
    return response.data;
  }

  async logMissedDose(patientId: string, medicationId: string, notes?: string): Promise<MedicationHistory> {
    const response = await api.post('/medication-stock/log-missed', {
      patientId,
      medicationId,
      notes,
    });
    return response.data;
  }

  // History & Analytics
  async getAdherenceRate(patientId: string, medicationId?: string, startDate?: string, endDate?: string): Promise<AdherenceData> {
    const params = new URLSearchParams();
    if (medicationId) params.append('medicationId', medicationId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/medication-stock/patient/${patientId}/adherence?${params.toString()}`);
    return response.data;
  }

  async getMedicationHistory(patientId: string, medicationId?: string, action?: string, limit?: number): Promise<MedicationHistory[]> {
    const params = new URLSearchParams();
    if (medicationId) params.append('medicationId', medicationId);
    if (action) params.append('action', action);
    if (limit) params.append('limit', limit.toString());
    
    const response = await api.get(`/medication-stock/patient/${patientId}/history?${params.toString()}`);
    return response.data;
  }
}

export const medicationService = new MedicationService();
