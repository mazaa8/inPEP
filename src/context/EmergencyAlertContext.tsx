import { createContext, useState, useContext, type ReactNode } from 'react';

interface EmergencyAlertContextType {
  isAlertActive: boolean;
  triggerAlert: (patientName: string, patientId: string, alertLevel: number) => void;
  resetAlert: () => void;
  escalateToProvider: () => void;
  patientName: string | null;
  patientId: string | null;
  alertLevel: number;
  isEscalated: boolean;
}

const EmergencyAlertContext = createContext<EmergencyAlertContextType | undefined>(undefined);

export const EmergencyAlertProvider = ({ children }: { children: ReactNode }) => {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [patientName, setPatientName] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [alertLevel, setAlertLevel] = useState(0);
  const [isEscalated, setIsEscalated] = useState(false);

  const triggerAlert = (name: string, id: string, level: number) => {
    setPatientName(name);
    setPatientId(id);
    setAlertLevel(level);
    setIsAlertActive(true);
    setIsEscalated(false); // Reset escalation on new alert
  };

  const resetAlert = () => {
    setIsAlertActive(false);
    setPatientName(null);
    setPatientId(null);
    setAlertLevel(0);
    setIsEscalated(false);
  };

  const escalateToProvider = () => {
    if (isAlertActive) {
      setIsEscalated(true);
    }
  };

  return (
    <EmergencyAlertContext.Provider value={{ isAlertActive, triggerAlert, resetAlert, escalateToProvider, patientName, patientId, alertLevel, isEscalated }}>
      {children}
    </EmergencyAlertContext.Provider>
  );
};

export const useEmergencyAlert = () => {
  const context = useContext(EmergencyAlertContext);
  if (context === undefined) {
    throw new Error('useEmergencyAlert must be used within an EmergencyAlertProvider');
  }
  return context;
};
