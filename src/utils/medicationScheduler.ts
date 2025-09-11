import { type Medication } from '../data/medications';

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';

export interface ScheduledMedication {
  medication: Medication;
  time: string; // e.g., "8:00 AM"
}

export interface Schedule {
  [key: string]: ScheduledMedication[];
}

export interface ScheduleWarning {
  message: string;
}

export interface GeneratedSchedule {
  schedule: Schedule;
  warnings: ScheduleWarning[];
}

const timeSlotMapping: Record<TimeSlot, string> = {
  Morning: '8:00 AM',
  Afternoon: '12:00 PM',
  Evening: '6:00 PM',
  Bedtime: '10:00 PM',
};

export const generateMedicationSchedule = (meds: Medication[]): GeneratedSchedule => {
  const schedule: Schedule = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Bedtime: [],
  };
  const warnings: ScheduleWarning[] = [];

  // Distribute medications into time slots
  meds.forEach(med => {
    switch (med.frequency) {
      case 'daily':
        if (med.timing.includes('morning')) schedule.Morning.push({ medication: med, time: timeSlotMapping.Morning });
        else if (med.timing.includes('afternoon')) schedule.Afternoon.push({ medication: med, time: timeSlotMapping.Afternoon });
        else if (med.timing.includes('evening')) schedule.Evening.push({ medication: med, time: timeSlotMapping.Evening });
        else if (med.timing.includes('bedtime')) schedule.Bedtime.push({ medication: med, time: timeSlotMapping.Bedtime });
        else schedule.Morning.push({ medication: med, time: timeSlotMapping.Morning }); // Default to morning
        break;
      case 'twice daily':
        schedule.Morning.push({ medication: med, time: timeSlotMapping.Morning });
        schedule.Evening.push({ medication: med, time: timeSlotMapping.Evening });
        break;
      case 'every 8 hours':
        schedule.Morning.push({ medication: med, time: '6:00 AM' });
        schedule.Afternoon.push({ medication: med, time: '2:00 PM' });
        schedule.Bedtime.push({ medication: med, time: '10:00 PM' });
        break;
    }
  });

  // Check for interactions
  const allScheduledMeds = Object.values(schedule).flat().map(sm => sm.medication);
  const medIds = new Set(allScheduledMeds.map(m => m.id));

  allScheduledMeds.forEach(med => {
    med.interactions.forEach(interactionId => {
      if (medIds.has(interactionId)) {
        const interactingMed = allScheduledMeds.find(m => m.id === interactionId);
        warnings.push({
          message: `Potential interaction between ${med.name} and ${interactingMed?.name}. Please consult a doctor.`,
        });
      }
    });
  });

  return { schedule, warnings };
};
