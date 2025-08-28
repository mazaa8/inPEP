import { useState } from 'react';
import { Calendar, momentLocalizer, type Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentsCalendar.css';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { Event } from '@mui/icons-material';
import EventDetailsModal from './EventDetailsModal';

const localizer = momentLocalizer(moment);

const events = [
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
  {
    title: 'Family Visit',
    start: new Date(2025, 8, 7, 13, 0),
    end: new Date(2025, 8, 7, 17, 0),
    description: 'The Johnsons are visiting in the afternoon.',
  },
];

const AppointmentsCalendar = () => {
  const [selectedEvent, setSelectedEvent] = useState<BigCalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectEvent = (event: BigCalendarEvent) => {
    setSelectedEvent(event);
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
        event={selectedEvent as any} 
      />
    </>
  );
};

export default AppointmentsCalendar;
