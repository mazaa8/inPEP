import { Typography, List, ListItem, ListItemText, Divider, Box, Chip } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

export interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CalendarIcon sx={{ color: '#21CBF3', mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
          Upcoming Appointments
        </Typography>
      </Box>
      <List sx={{ p: 0 }}>
        {appointments.map((appointment, index) => (
          <div key={appointment.id}>
            <ListItem 
              alignItems="flex-start" 
              sx={{ 
                px: 0,
                py: 2,
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.05)',
                  borderRadius: '8px',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
                    Dr. {appointment.doctor}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Chip 
                      label={appointment.specialty} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(33, 150, 243, 0.2)', 
                        color: '#21CBF3',
                        fontWeight: 600,
                        mb: 0.5,
                      }} 
                    />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
                      {appointment.date} at {appointment.time}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < appointments.length - 1 && <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />}
          </div>
        ))}
      </List>
    </>
  );
};

export default UpcomingAppointments;
