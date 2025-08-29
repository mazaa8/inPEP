import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

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
      <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
      <List>
        {appointments.map((appointment, index) => (
          <div key={appointment.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={`Dr. ${appointment.doctor} - ${appointment.specialty}`}
                secondary={`${appointment.date} at ${appointment.time}`}
              />
            </ListItem>
            {index < appointments.length - 1 && <Divider variant="inset" component="li" />}
          </div>
        ))}
      </List>
    </>
  );
};

export default UpcomingAppointments;
