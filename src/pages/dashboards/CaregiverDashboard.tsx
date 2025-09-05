import { useState } from 'react';
import { Grid } from '@mui/material';
import Layout from '../../components/layout/Layout';
import TodaysSummary from '../../components/dashboards/caregiver/TodaysSummary';
import MedicationChecklist, { type Medication } from '../../components/dashboards/caregiver/MedicationChecklist';
import AppointmentsCalendar, { type AppointmentEvent } from '../../components/dashboards/caregiver/AppointmentsCalendar';
import VitalsLog, { type VitalsData } from '../../components/dashboards/caregiver/VitalsLog';
import WeeklyMealPlanner from '../../components/dashboards/caregiver/WeeklyMealPlanner';

const appointmentsData: AppointmentEvent[] = [
  {
    title: 'Dr. Smith Appointment',
    start: new Date(2025, 8, 2, 10, 0),
    end: new Date(2025, 8, 2, 11, 0),
    description: 'Routine check-up with Dr. Smith. Remember to bring the latest test results.',
    specialty: 'Cardiology',
    location: 'Springfield General Hospital, 123 Health St.',
  },
  {
    title: 'Physical Therapy',
    start: new Date(2025, 8, 4, 14, 0),
    end: new Date(2025, 8, 4, 15, 0),
    description: 'Session focusing on lower back exercises.',
    specialty: 'Orthopedic Physical Therapy',
    location: 'Community Rehab Center, 456 Wellness Ave.',
  },
];

const vitalsData: VitalsData[] = [
  { name: 'Mon', heartRate: 72, bp: 120 },
  { name: 'Tue', heartRate: 75, bp: 122 },
  { name: 'Wed', heartRate: 78, bp: 118 },
  { name: 'Thu', heartRate: 74, bp: 121 },
  { name: 'Fri', heartRate: 76, bp: 125 },
  { name: 'Sat', heartRate: 73, bp: 123 },
  { name: 'Sun', heartRate: 71, bp: 119 },
];

const initialMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dose: '10mg', time: '8:00 AM', taken: true },
  { id: 2, name: 'Metformin', dose: '500mg', time: '8:00 AM', taken: true },
  { id: 3, name: 'Atorvastatin', dose: '20mg', time: '8:00 PM', taken: false },
  { id: 4, name: 'Aspirin', dose: '81mg', time: '8:00 PM', taken: false },
];

const summaryData = {
  mood: 'Cheerful and energetic',
  notes: 'Watched a movie in the afternoon.',
  tasks: ['Morning medication due', 'Check blood pressure at 3 PM'],
};

const CaregiverDashboard = () => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const handleToggleMedication = (id: number) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  return (
    <Layout title="Caregiver Dashboard">
      <Grid container spacing={3}>
        {/* Main column for smaller components */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TodaysSummary mood={summaryData.mood} notes={summaryData.notes} tasks={summaryData.tasks} />
            </Grid>
            <Grid item xs={12}>
              <MedicationChecklist medications={medications} onToggle={handleToggleMedication} />
            </Grid>
            <Grid item xs={12}>
              <VitalsLog data={vitalsData} />
            </Grid>
                      </Grid>
        </Grid>
        {/* Larger column for the calendar */}
        <Grid item xs={12} lg={8}>
          <WeeklyMealPlanner />
          <AppointmentsCalendar events={appointmentsData} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CaregiverDashboard;
