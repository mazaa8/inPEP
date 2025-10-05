import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import Layout from '../../components/layout/Layout';
import TodaysSummary from '../../components/dashboards/caregiver/TodaysSummary';
import Reminders from '../../components/dashboards/caregiver/Reminders';
import MedicationChecklist, { type Medication } from '../../components/dashboards/caregiver/MedicationChecklist';
import AppointmentsCalendar, { type AppointmentEvent } from '../../components/dashboards/caregiver/AppointmentsCalendar';
import VitalsLog, { type VitalsData } from '../../components/dashboards/caregiver/VitalsLog';
import { appointmentService } from '../../services/appointmentService';

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

const remindersData = ['Morning medication due', 'Check blood pressure at 3 PM'];

const CaregiverDashboard = () => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        
        // Transform API data to calendar event format
        const transformedAppointments: AppointmentEvent[] = data.map((apt) => ({
          title: apt.title,
          start: new Date(apt.startTime),
          end: new Date(apt.endTime),
          description: apt.description || '',
          specialty: apt.specialty || '',
          location: apt.location || '',
        }));
        
        setAppointments(transformedAppointments);
      } catch (err) {
        console.error('Failed to load appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  const handleToggleMedication = (id: number) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  return (
    <Layout title="Caregiving Patient Monitor">
      <Grid container spacing={3}>
        {/* Main column for smaller components */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TodaysSummary />
            </Grid>
            <Grid item xs={12}>
              <Reminders tasks={remindersData} />
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
          <AppointmentsCalendar events={appointments} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CaregiverDashboard;
