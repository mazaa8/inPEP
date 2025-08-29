import { Paper, Typography } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { EventNote, Healing, CheckCircle } from '@mui/icons-material';

const PatientJourneys = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Patient & Caregiver Journeys</Typography>
      <Timeline position="alternate">
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="primary">
              <EventNote />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Discharge Day
            </Typography>
            <Typography>Patient discharged and onboarded to InPEP.</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="secondary">
              <Healing />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Week 1 Check-in
            </Typography>
            <Typography>Vitals stable, medication adherence at 95%.</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="success">
              <CheckCircle />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              Upcoming: Follow-up Appointment
            </Typography>
            <Typography>Scheduled for 2025-09-15.</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot color="grey">
              <EventNote />
            </TimelineDot>
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              End of Program
            </Typography>
            <Typography>Target date: 2025-10-01.</Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Paper>
  );
};

export default PatientJourneys;
