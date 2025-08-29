import { createContext, useState, useContext, type ReactNode } from 'react';

interface EmergencyAlertContextType {
  isAlertActive: boolean;
  triggerAlert: (patientName: string) => void;
  resetAlert: () => void;
  patientName: string | null;
}

const EmergencyAlertContext = createContext<EmergencyAlertContextType | undefined>(undefined);

export const EmergencyAlertProvider = ({ children }: { children: ReactNode }) => {
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [patientName, setPatientName] = useState<string | null>(null);

  const triggerAlert = (name: string) => {
    setPatientName(name);
    setIsAlertActive(true);
  };

  const resetAlert = () => {
    setIsAlertActive(false);
    setPatientName(null);
  };

  return (
    <EmergencyAlertContext.Provider value={{ isAlertActive, triggerAlert, resetAlert, patientName }}>
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
