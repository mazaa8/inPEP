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
import { Typography, Box, Avatar } from '@mui/material';
import { Event } from '@mui/icons-material';
import EventDetailsModal from './EventDetailsModal';
import { roleColors } from '../../../styles/glassmorphism';

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
      <Box sx={{ 
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '20px',
        p: 3,
        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(76, 175, 80, 0.15)',
        },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ 
            background: roleColors.CAREGIVER.gradient,
            color: '#fff', 
            mr: 2,
            width: 48,
            height: 48,
            boxShadow: `0 4px 16px ${roleColors.CAREGIVER.primary}40`,
          }}>
            <Event />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b5e20' }}>
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
      </Box>
      <EventDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent} 
      />
    </>
  );
};

export default AppointmentsCalendar;
