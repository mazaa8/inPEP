import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Health Timeline Integration Service
 * Connects Patient Journal with other health systems for unified view
 */

export interface TimelineEvent {
  id: string;
  type: 'journal' | 'medication' | 'appointment' | 'vital' | 'meal';
  date: Date;
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  mood?: string;
  data?: any;
}

/**
 * Get unified health timeline for a patient
 * Combines journal entries, medications, appointments, vitals, and meals
 */
export async function getHealthTimeline(
  patientId: string,
  startDate: Date,
  endDate: Date
): Promise<TimelineEvent[]> {
  const timeline: TimelineEvent[] = [];

  // 1. Get journal entries
  const journalEntries = await prisma.patientJournalEntry.findMany({
    where: {
      patientId,
      entryDate: { gte: startDate, lte: endDate },
    },
    orderBy: { entryDate: 'desc' },
  });

  journalEntries.forEach(entry => {
    timeline.push({
      id: `journal-${entry.id}`,
      type: 'journal',
      date: new Date(entry.entryDate),
      title: entry.title,
      description: entry.content,
      severity: getSeverityFromEventType(entry.eventType),
      mood: entry.mood || undefined,
      data: {
        eventType: entry.eventType,
        tags: entry.tags,
        sharedWithProvider: entry.sharedWithProvider,
      },
    });
  });

  // 2. Get medication history
  const medications = await prisma.medicationHistory.findMany({
    where: {
      patientId,
      timestamp: { gte: startDate, lte: endDate },
    },
    include: {
      medication: true,
    },
    orderBy: { timestamp: 'desc' },
  });

  medications.forEach(med => {
    timeline.push({
      id: `medication-${med.id}`,
      type: 'medication',
      date: new Date(med.timestamp),
      title: `${med.medication?.name || 'Medication'} - ${med.action}`,
      description: med.notes || `${med.action} at ${new Date(med.timestamp).toLocaleTimeString()}`,
      severity: med.action === 'missed' ? 'medium' : 'low',
      data: {
        medicationId: med.medicationId,
        action: med.action,
        dosage: med.medication?.dosage,
      },
    });
  });

  // 3. Get appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId,
      date: { gte: startDate, lte: endDate },
    },
    include: {
      provider: true,
    },
    orderBy: { date: 'desc' },
  });

  appointments.forEach(apt => {
    timeline.push({
      id: `appointment-${apt.id}`,
      type: 'appointment',
      date: new Date(apt.date),
      title: `Appointment: ${apt.type}`,
      description: `With ${apt.provider?.name || 'Provider'} - ${apt.status}`,
      severity: apt.status === 'CANCELLED' ? 'medium' : 'low',
      data: {
        providerId: apt.providerId,
        type: apt.type,
        status: apt.status,
        notes: apt.notes,
      },
    });
  });

  // 4. Get vitals
  const vitals = await prisma.healthMetric.findMany({
    where: {
      patientId,
      recordedAt: { gte: startDate, lte: endDate },
    },
    orderBy: { recordedAt: 'desc' },
  });

  vitals.forEach(vital => {
    const isAbnormal = checkVitalAbnormality(vital.type, vital.value);
    timeline.push({
      id: `vital-${vital.id}`,
      type: 'vital',
      date: new Date(vital.recordedAt),
      title: `${vital.type}: ${vital.value} ${vital.unit}`,
      description: `Recorded by ${vital.recordedBy}`,
      severity: isAbnormal ? 'high' : 'low',
      data: {
        type: vital.type,
        value: vital.value,
        unit: vital.unit,
      },
    });
  });

  // 5. Get meals
  const meals = await prisma.plannedMeal.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
    include: {
      recipe: true,
    },
    orderBy: { date: 'desc' },
  });

  meals.forEach(meal => {
    timeline.push({
      id: `meal-${meal.id}`,
      type: 'meal',
      date: new Date(meal.date),
      title: `${meal.mealType}: ${meal.recipe?.title || 'Meal'}`,
      description: meal.isCompleted ? 'Completed' : 'Planned',
      severity: 'low',
      data: {
        mealType: meal.mealType,
        isCompleted: meal.isCompleted,
        recipeId: meal.recipeId,
      },
    });
  });

  // Sort all events by date (most recent first)
  timeline.sort((a, b) => b.date.getTime() - a.date.getTime());

  return timeline;
}

/**
 * Get severity level from journal event type
 */
function getSeverityFromEventType(eventType: string): 'low' | 'medium' | 'high' | 'critical' {
  const severityMap: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
    'Seizure': 'critical',
    'Fall': 'high',
    'Allergic Reaction': 'critical',
    'Behavioral Change': 'medium',
    'General Note': 'low',
  };
  return severityMap[eventType] || 'low';
}

/**
 * Check if vital reading is abnormal
 */
function checkVitalAbnormality(type: string, value: number): boolean {
  const normalRanges: Record<string, { min: number; max: number }> = {
    'Blood Pressure Systolic': { min: 90, max: 140 },
    'Blood Pressure Diastolic': { min: 60, max: 90 },
    'Heart Rate': { min: 60, max: 100 },
    'Temperature': { min: 97, max: 99 },
    'Oxygen Saturation': { min: 95, max: 100 },
    'Blood Glucose': { min: 70, max: 140 },
  };

  const range = normalRanges[type];
  if (!range) return false;

  return value < range.min || value > range.max;
}

/**
 * Find correlations between journal events and other health data
 */
export async function findHealthCorrelations(
  patientId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  seizuresMedicationCorrelation: number;
  fallsVitalsCorrelation: number;
  moodMealsCorrelation: number;
  insights: string[];
}> {
  const insights: string[] = [];

  // Get journal entries with seizures
  const seizureEntries = await prisma.patientJournalEntry.findMany({
    where: {
      patientId,
      eventType: 'Seizure',
      entryDate: { gte: startDate, lte: endDate },
    },
  });

  // Get missed medications
  const missedMeds = await prisma.medicationHistory.findMany({
    where: {
      patientId,
      action: 'missed',
      timestamp: { gte: startDate, lte: endDate },
    },
  });

  // Calculate seizure-medication correlation
  let seizuresAfterMissedMeds = 0;
  seizureEntries.forEach(seizure => {
    const seizureDate = new Date(seizure.entryDate);
    const recentMissedMeds = missedMeds.filter(med => {
      const medDate = new Date(med.timestamp);
      const hoursDiff = (seizureDate.getTime() - medDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff >= 0 && hoursDiff <= 48; // Within 48 hours
    });
    if (recentMissedMeds.length > 0) {
      seizuresAfterMissedMeds++;
    }
  });

  const seizuresMedicationCorrelation = seizureEntries.length > 0
    ? (seizuresAfterMissedMeds / seizureEntries.length) * 100
    : 0;

  if (seizuresMedicationCorrelation > 60) {
    insights.push(
      `Strong correlation detected: ${Math.round(seizuresMedicationCorrelation)}% of seizures occurred within 48 hours of missed medications`
    );
  }

  // Get fall entries
  const fallEntries = await prisma.patientJournalEntry.findMany({
    where: {
      patientId,
      eventType: 'Fall',
      entryDate: { gte: startDate, lte: endDate },
    },
  });

  // Get abnormal vitals
  const vitals = await prisma.healthMetric.findMany({
    where: {
      patientId,
      recordedAt: { gte: startDate, lte: endDate },
    },
  });

  const abnormalVitals = vitals.filter(v => checkVitalAbnormality(v.type, v.value));

  // Calculate falls-vitals correlation
  let fallsAfterAbnormalVitals = 0;
  fallEntries.forEach(fall => {
    const fallDate = new Date(fall.entryDate);
    const recentAbnormalVitals = abnormalVitals.filter(vital => {
      const vitalDate = new Date(vital.recordedAt);
      const hoursDiff = (fallDate.getTime() - vitalDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff >= 0 && hoursDiff <= 24; // Within 24 hours
    });
    if (recentAbnormalVitals.length > 0) {
      fallsAfterAbnormalVitals++;
    }
  });

  const fallsVitalsCorrelation = fallEntries.length > 0
    ? (fallsAfterAbnormalVitals / fallEntries.length) * 100
    : 0;

  if (fallsVitalsCorrelation > 50) {
    insights.push(
      `Falls correlation: ${Math.round(fallsVitalsCorrelation)}% of falls occurred within 24 hours of abnormal vital signs`
    );
  }

  // Get mood entries
  const moodEntries = await prisma.patientJournalEntry.findMany({
    where: {
      patientId,
      mood: { not: null },
      entryDate: { gte: startDate, lte: endDate },
    },
  });

  // Get meal completion
  const meals = await prisma.plannedMeal.findMany({
    where: {
      date: { gte: startDate, lte: endDate },
    },
  });

  const completedMeals = meals.filter(m => m.isCompleted).length;
  const mealCompletionRate = meals.length > 0 ? (completedMeals / meals.length) * 100 : 0;

  const negativeMoods = moodEntries.filter(e => ['sad', 'angry', 'anxious'].includes(e.mood || '')).length;
  const negativeMoodRate = moodEntries.length > 0 ? (negativeMoods / moodEntries.length) * 100 : 0;

  const moodMealsCorrelation = 100 - Math.abs(mealCompletionRate - (100 - negativeMoodRate));

  if (moodMealsCorrelation > 70 && negativeMoodRate > 40) {
    insights.push(
      `Mood-nutrition link: Low meal completion (${Math.round(mealCompletionRate)}%) correlates with negative mood patterns`
    );
  }

  return {
    seizuresMedicationCorrelation: Math.round(seizuresMedicationCorrelation),
    fallsVitalsCorrelation: Math.round(fallsVitalsCorrelation),
    moodMealsCorrelation: Math.round(moodMealsCorrelation),
    insights,
  };
}

/**
 * Link journal entry to related health events
 */
export async function linkJournalToHealthEvents(journalEntryId: string): Promise<{
  relatedMedications: any[];
  relatedAppointments: any[];
  relatedVitals: any[];
  relatedMeals: any[];
}> {
  const entry = await prisma.patientJournalEntry.findUnique({
    where: { id: journalEntryId },
  });

  if (!entry) {
    return {
      relatedMedications: [],
      relatedAppointments: [],
      relatedVitals: [],
      relatedMeals: [],
    };
  }

  const entryDate = new Date(entry.entryDate);
  const startOfDay = new Date(entryDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(entryDate.setHours(23, 59, 59, 999));

  // Find medications on same day
  const relatedMedications = await prisma.medicationHistory.findMany({
    where: {
      patientId: entry.patientId,
      timestamp: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      medication: true,
    },
  });

  // Find appointments on same day
  const relatedAppointments = await prisma.appointment.findMany({
    where: {
      patientId: entry.patientId,
      date: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      provider: true,
    },
  });

  // Find vitals on same day
  const relatedVitals = await prisma.healthMetric.findMany({
    where: {
      patientId: entry.patientId,
      recordedAt: { gte: startOfDay, lte: endOfDay },
    },
  });

  // Find meals on same day
  const relatedMeals = await prisma.plannedMeal.findMany({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      recipe: true,
    },
  });

  return {
    relatedMedications,
    relatedAppointments,
    relatedVitals,
    relatedMeals,
  };
}
