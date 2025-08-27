import { Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const appointments = [
  { id: 1, doctor: 'Dr. Smith', specialty: 'Cardiology', date: '2025-09-15', time: '10:00 AM' },
  { id: 2, doctor: 'Dr. Jones', specialty: 'Dermatology', date: '2025-09-22', time: '02:30 PM' },
];

const UpcomingAppointments = () => {
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
