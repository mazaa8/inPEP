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
    
    return await api.get<Medication[]>(`/medications?${params.toString()}`);
  }

  async getMedicationById(id: string): Promise<Medication> {
    return await api.get<Medication>(`/medications/${id}`);
  }

  async getMedicationAlternatives(id: string): Promise<MedicationAlternative[]> {
    return await api.get<MedicationAlternative[]>(`/medications/${id}/alternatives`);
  }

  async checkDrugInteractions(medicationIds: string[]): Promise<DrugInteraction[]> {
    return await api.post<DrugInteraction[]>('/medications/check-interactions', { medicationIds });
  }

  async searchByBarcode(ndc: string): Promise<Medication> {
    return await api.get<Medication>(`/medications/barcode/${ndc}`);
  }

  // Prescriptions
  async getPatientPrescriptions(patientId: string, status?: string): Promise<Prescription[]> {
    const params = status ? `?status=${status}` : '';
    return await api.get<Prescription[]>(`/prescriptions/patient/${patientId}${params}`);
  }

  async getPrescriptionById(id: string): Promise<Prescription> {
    return await api.get<Prescription>(`/prescriptions/${id}`);
  }

  async createPrescription(data: any): Promise<Prescription> {
    return await api.post<Prescription>('/prescriptions', data);
  }

  async requestRefill(prescriptionId: string, data: any): Promise<RefillRequest> {
    return await api.post<RefillRequest>(`/prescriptions/${prescriptionId}/refill`, data);
  }

  async approveRefill(refillId: string): Promise<RefillRequest> {
    return await api.patch<RefillRequest>(`/prescriptions/refill/${refillId}/approve`);
  }

  async markRefillFilled(refillId: string, quantity: number): Promise<RefillRequest> {
    return await api.patch<RefillRequest>(`/prescriptions/refill/${refillId}/filled`, { quantity });
  }

  // Stock Management
  async getPatientStock(patientId: string): Promise<MedicationStock[]> {
    return await api.get<MedicationStock[]>(`/medication-stock/patient/${patientId}`);
  }

  async getLowStockAlerts(patientId: string): Promise<MedicationStock[]> {
    return await api.get<MedicationStock[]>(`/medication-stock/patient/${patientId}/low-stock`);
  }

  async updateStock(stockId: string, change: number, action?: string, notes?: string): Promise<MedicationStock> {
    return await api.post<MedicationStock>('/medication-stock/update', {
      stockId,
      change,
      action,
      notes,
    });
  }

  async logDoseTaken(patientId: string, medicationId: string, dosageTaken: string, notes?: string): Promise<MedicationHistory> {
    return await api.post<MedicationHistory>('/medication-stock/log-dose', {
      patientId,
      medicationId,
      dosageTaken,
      notes,
    });
  }

  async logMissedDose(patientId: string, medicationId: string, notes?: string): Promise<MedicationHistory> {
    return await api.post<MedicationHistory>('/medication-stock/log-missed', {
      patientId,
      medicationId,
      notes,
    });
  }

  // History & Analytics
  async getAdherenceRate(patientId: string, medicationId?: string, startDate?: string, endDate?: string): Promise<AdherenceData> {
    const params = new URLSearchParams();
    if (medicationId) params.append('medicationId', medicationId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return await api.get<AdherenceData>(`/medication-stock/patient/${patientId}/adherence?${params.toString()}`);
  }

  async getMedicationHistory(patientId: string, medicationId?: string, action?: string, limit?: number): Promise<MedicationHistory[]> {
    const params = new URLSearchParams();
    if (medicationId) params.append('medicationId', medicationId);
    if (action) params.append('action', action);
    if (limit) params.append('limit', limit.toString());
    
    return await api.get<MedicationHistory[]>(`/medication-stock/patient/${patientId}/history?${params.toString()}`);
  }
}

export const medicationService = new MedicationService();
