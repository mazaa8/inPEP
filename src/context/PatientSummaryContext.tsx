import { createContext, useState, useContext, type ReactNode } from 'react';

interface PatientSummary {
  mood: string;
  notes: string;
}

interface PatientSummaryContextType {
  summary: PatientSummary;
  updateSummary: (summary: Partial<PatientSummary>) => void;
}

const PatientSummaryContext = createContext<PatientSummaryContextType | undefined>(undefined);

export const PatientSummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summary, setSummary] = useState<PatientSummary>({ 
    mood: 'Cheerful and energetic',
    notes: 'Watched a movie in the afternoon.'
  });

  const updateSummary = (newSummary: Partial<PatientSummary>) => {
    setSummary(prevSummary => ({ ...prevSummary, ...newSummary }));
  };

  return (
    <PatientSummaryContext.Provider value={{ summary, updateSummary }}>
      {children}
    </PatientSummaryContext.Provider>
  );
};

export const usePatientSummary = () => {
  const context = useContext(PatientSummaryContext);
  if (context === undefined) {
    throw new Error('usePatientSummary must be used within a PatientSummaryProvider');
  }
  return context;
};
