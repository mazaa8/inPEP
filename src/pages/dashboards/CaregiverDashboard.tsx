import { useState, useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { FavoriteBorder as CaregiverIcon } from '@mui/icons-material';
import Layout from '../../components/layout/Layout';
import TodaysSummary from '../../components/dashboards/caregiver/TodaysSummary';
import Reminders from '../../components/dashboards/caregiver/Reminders';
import MedicationChecklist from '../../components/dashboards/caregiver/MedicationChecklist';
import AppointmentsCalendar, { type AppointmentEvent } from '../../components/dashboards/caregiver/AppointmentsCalendar';
import VitalsLog, { type VitalsData } from '../../components/dashboards/caregiver/VitalsLog';
import CaregiverAIInsightsDashboard from '../../components/health/CaregiverAIInsightsDashboard';
import { appointmentService } from '../../services/appointmentService';
import { roleColors } from '../../styles/glassmorphism';

const vitalsData: VitalsData[] = [
  { name: 'Mon', heartRate: 72, bp: 120 },
  { name: 'Tue', heartRate: 75, bp: 122 },
  { name: 'Wed', heartRate: 78, bp: 118 },
  { name: 'Thu', heartRate: 74, bp: 121 },
  { name: 'Fri', heartRate: 76, bp: 125 },
  { name: 'Sat', heartRate: 73, bp: 123 },
  { name: 'Sun', heartRate: 71, bp: 119 },
];

const patientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White

const remindersData = ['Morning medication due', 'Check blood pressure at 3 PM'];

const CaregiverDashboard = () => {
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

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      p: 0,
    }}>
      <Layout title="" darkMode={false} themeColor="CAREGIVER">
        {/* Hero Header */}
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          p: 4,
          mb: 4,
          boxShadow: '0 8px 32px 0 rgba(76, 175, 80, 0.15)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 72,
              height: 72,
              borderRadius: '18px',
              background: roleColors.CAREGIVER.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${roleColors.CAREGIVER.primary}40`,
            }}>
              <CaregiverIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1b5e20', mb: 0.5 }}>
                Patient Monitor
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                Track your loved one's health and care schedule
              </Typography>
            </Box>
          </Box>
        </Box>

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
              <MedicationChecklist patientId={patientId} />
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
        {/* AI Health Insights - Full width */}
        <Grid item xs={12}>
          <Box sx={{ 
            p: 4,
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '14px',
                background: roleColors.CAREGIVER.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
              }}>
                <Typography sx={{ fontSize: '1.8rem' }}>✨</Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Patient Health Insights
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(27, 94, 32, 0.7)' }}>
                  AI-powered health monitoring and recommendations
                </Typography>
              </Box>
            </Box>
            <CaregiverAIInsightsDashboard patientId="b805ec90-e553-4de7-9de0-45f2eb73d1ba" />
          </Box>
        </Grid>
      </Grid>
      </Layout>
    </Box>
  );
};

export default CaregiverDashboard;
