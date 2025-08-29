import { useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer, type Event as BigCalendarEvent } from 'react-big-calendar';

// Define a more specific event type for appointments
export interface AppointmentEvent extends Omit<BigCalendarEvent, 'title'> {
  title: string; // Override title to be a required string
  description?: string;
  specialty?: string;
  location?: string;
}
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { Event } from '@mui/icons-material';
import EventDetailsModal from './EventDetailsModal';

const localizer = momentLocalizer(moment);

interface AppointmentsCalendarProps {
  events: AppointmentEvent[];
}


const AppointmentsCalendar = ({ events }: AppointmentsCalendarProps) => {
  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectEvent = (event: BigCalendarEvent) => {
    // We cast here after confirming the event shape, ensuring type safety with the modal
    setSelectedEvent(event as AppointmentEvent);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <Card sx={{ background: 'linear-gradient(135deg, #F4F7F6 0%, #E9EFEE 100%)', color: '#2D4A43', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.1)', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ background: 'linear-gradient(135deg, #78A698 0%, #4A7C6E 100%)', color: '#fff', mr: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <Event />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
              Appointments Calendar
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
            />
          </Box>
        </CardContent>
      </Card>
      <EventDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent} 
      />
    </>
  );
};

export default AppointmentsCalendar;
