import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * AI Adherence Tracking Data Aggregation Service
 * Secretly pulls non-private data from patient and caregiver dashboards
 */

// Calculate medication adherence score
async function calculateMedicationScore(patientId: string, startDate: Date, endDate: Date): Promise<number> {
  // Get medication history for the period
  const medicationHistory = await prisma.medicationHistory.findMany({
    where: {
      patientId,
      timestamp: { gte: startDate, lte: endDate },
    },
  });
  
  if (medicationHistory.length === 0) return 0;
  
  const takenCount = medicationHistory.filter(h => h.action === 'taken').length;
  const missedCount = medicationHistory.filter(h => h.action === 'missed').length;
  const total = takenCount + missedCount;
  
  if (total === 0) return 0;
  
  return (takenCount / total) * 100;
}

// Calculate meal plan adherence score
async function calculateMealPlanScore(patientId: string, startDate: Date, endDate: Date): Promise<number> {
  // Get planned meals for the period
  const plannedMeals = await prisma.plannedMeal.findMany({
    where: {
      mealPlanId: { not: undefined },
      date: { gte: startDate, lte: endDate },
    },
  });
  
  if (plannedMeals.length === 0) return 0;
  
  const completedCount = plannedMeals.filter(m => m.isCompleted).length;
  
  return (completedCount / plannedMeals.length) * 100;
}

// Calculate vitals tracking score
async function calculateVitalsScore(patientId: string, startDate: Date, endDate: Date): Promise<number> {
  // Get health metrics for the period
  const metrics = await prisma.healthMetric.findMany({
    where: {
      patientId,
      recordedAt: { gte: startDate, lte: endDate },
    },
  });
  
  // Expected: at least 1 vital per day
  const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const expectedCount = daysInPeriod;
  
  const actualCount = metrics.length;
  const score = Math.min((actualCount / expectedCount) * 100, 100);
  
  return score;
}

// Calculate mood tracking score (from patient mood board)
async function calculateMoodScore(patientId: string, startDate: Date, endDate: Date): Promise<number> {
  // This would pull from patient daily summary/mood board
  // For now, using health insights as proxy
  const insights = await prisma.healthInsight.findMany({
    where: {
      patientId,
      category: 'GENERAL',
      generatedAt: { gte: startDate, lte: endDate },
    },
  });
  
  // If patient is logging mood regularly, they get points
  const daysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const score = Math.min((insights.length / daysInPeriod) * 100, 100);
  
  return score;
}

// Calculate exercise score
async function calculateExerciseScore(patientId: string, startDate: Date, endDate: Date): Promise<number> {
  // Placeholder - would integrate with fitness tracking
  return 75; // Default moderate score
}

// Calculate sleep score
async function calculateSleepScore(patientId: string, startDate: Date, endDate: Date): Promise<number> {
  // Placeholder - would integrate with sleep tracking
  return 80; // Default good score
}

// Aggregate all scores for a patient
export async function aggregateAdherenceScores(patientId: string, date: Date = new Date()): Promise<void> {
  try {
    // Calculate for the last 24 hours
    const endDate = date;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 1);
    
    // Get week start (Monday)
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    
    // Calculate individual scores
    const medicationScore = await calculateMedicationScore(patientId, startDate, endDate);
    const mealPlanScore = await calculateMealPlanScore(patientId, startDate, endDate);
    const vitalsScore = await calculateVitalsScore(patientId, startDate, endDate);
    const moodScore = await calculateMoodScore(patientId, startDate, endDate);
    const exerciseScore = await calculateExerciseScore(patientId, startDate, endDate);
    const sleepScore = await calculateSleepScore(patientId, startDate, endDate);
    
    // Calculate overall score (weighted average)
    const overallScore = (
      medicationScore * 0.3 +
      mealPlanScore * 0.2 +
      vitalsScore * 0.2 +
      moodScore * 0.15 +
      exerciseScore * 0.075 +
      sleepScore * 0.075
    );
    
    // Get patient name
    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: { user: true },
    });
    
    if (!patient) return;
    
    // Calculate trend (compare with previous day)
    const previousScore = await prisma.adherenceScore.findFirst({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
    
    let trend = 'stable';
    let weeklyChange = 0;
    
    if (previousScore) {
      const diff = overallScore - previousScore.overallScore;
      if (diff > 5) trend = 'up';
      else if (diff < -5) trend = 'down';
      weeklyChange = diff;
    }
    
    // Count data points
    const dataPointsCount = await prisma.adherenceDataPoint.count({
      where: {
        patientId,
        timestamp: { gte: startDate, lte: endDate },
      },
    });
    
    // Save adherence score
    await prisma.adherenceScore.create({
      data: {
        patientId,
        patientName: patient.user.name,
        overallScore,
        medicationScore,
        mealPlanScore,
        vitalsScore,
        moodScore,
        exerciseScore,
        sleepScore,
        trend,
        weeklyChange,
        date,
        weekStart,
        dataPointsCount,
        confidence: 0.85,
      },
    });
    
    // Also save behavior pattern
    await prisma.behaviorPattern.create({
      data: {
        patientId,
        medicationScore,
        mealPlanScore,
        exerciseScore,
        sleepScore,
        moodScore,
        vitalsScore,
        date,
        periodType: 'daily',
      },
    });
    
    console.log(`Aggregated adherence scores for patient ${patientId}`);
  } catch (error) {
    console.error(`Error aggregating adherence scores for patient ${patientId}:`, error);
  }
}

// Calculate risk score for a patient
export async function calculatePatientRiskScore(patientId: string): Promise<void> {
  try {
    // Get latest adherence score
    const adherenceScore = await prisma.adherenceScore.findFirst({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
    
    if (!adherenceScore) return;
    
    // Get patient info
    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: { user: true },
    });
    
    if (!patient) return;
    
    // Calculate health score (inverse of risk)
    const healthScore = Math.round(adherenceScore.overallScore);
    
    // Determine risk level
    let riskLevel = 'low';
    if (healthScore < 50) riskLevel = 'critical';
    else if (healthScore < 65) riskLevel = 'high';
    else if (healthScore < 80) riskLevel = 'medium';
    
    // Calculate specific risks
    const medicationRisk = 100 - adherenceScore.medicationScore;
    const readmissionRisk = medicationRisk * 0.7 + (100 - adherenceScore.vitalsScore) * 0.3;
    
    // Check caregiver engagement
    const caregiverEngagement = await prisma.caregiverEngagement.findFirst({
      where: { patientId },
      orderBy: { weekStart: 'desc' },
    });
    
    const caregiverBurnout = caregiverEngagement?.burnoutRisk || 0;
    
    // Risk factors
    const riskFactors = [];
    if (adherenceScore.medicationScore < 70) riskFactors.push('Low medication adherence');
    if (adherenceScore.moodScore < 70) riskFactors.push('Declining mood scores');
    if (adherenceScore.vitalsScore < 70) riskFactors.push('Irregular vitals tracking');
    if (caregiverBurnout > 60) riskFactors.push('Caregiver stress indicators');
    
    // Protective factors
    const protectiveFactors = [];
    if (adherenceScore.medicationScore > 85) protectiveFactors.push('Excellent medication adherence');
    if (caregiverEngagement && caregiverEngagement.engagementScore > 80) protectiveFactors.push('High caregiver engagement');
    if (adherenceScore.vitalsScore > 85) protectiveFactors.push('Regular vitals monitoring');
    
    // Save risk score
    await prisma.patientRiskScore.create({
      data: {
        patientId,
        patientName: patient.user.name,
        healthScore,
        riskLevel,
        adherenceRate: adherenceScore.overallScore,
        trend: adherenceScore.trend,
        riskFactors: JSON.stringify(riskFactors),
        protectiveFactors: JSON.stringify(protectiveFactors),
        readmissionRisk,
        medicationRisk,
        caregiverBurnout,
        assessmentDate: new Date(),
      },
    });
    
    console.log(`Calculated risk score for patient ${patientId}: ${riskLevel}`);
  } catch (error) {
    console.error(`Error calculating risk score for patient ${patientId}:`, error);
  }
}

// Generate predictive insights
export async function generatePredictiveInsights(patientId: string): Promise<void> {
  try {
    const riskScore = await prisma.patientRiskScore.findFirst({
      where: { patientId },
      orderBy: { assessmentDate: 'desc' },
    });
    
    if (!riskScore) return;
    
    const adherenceScore = await prisma.adherenceScore.findFirst({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
    
    if (!adherenceScore) return;
    
    // Generate insights based on risk factors
    const insights = [];
    
    // Medication non-adherence prediction
    if (adherenceScore.medicationScore < 75 && adherenceScore.trend === 'down') {
      insights.push({
        predictionType: 'medication_nonadherence',
        prediction: 'High risk of medication non-adherence in next 48 hours',
        confidence: 87,
        factors: ['Declining medication adherence', 'Downward trend', 'Missed doses this week'],
        recommendation: 'Schedule check-in call, consider medication reminder adjustment',
        priority: 'high',
      });
    }
    
    // Readmission risk
    if (riskScore.readmissionRisk > 60) {
      insights.push({
        predictionType: 'readmission',
        prediction: 'Potential hospital readmission risk within 7 days',
        confidence: Math.round(riskScore.readmissionRisk),
        factors: ['Low medication adherence', 'Irregular vitals tracking', 'High risk score'],
        recommendation: 'Urgent: Schedule in-person visit, review care plan',
        priority: 'urgent',
      });
    }
    
    // Caregiver burnout
    if (riskScore.caregiverBurnout > 70) {
      insights.push({
        predictionType: 'caregiver_burnout',
        prediction: 'Caregiver burnout indicators detected',
        confidence: Math.round(riskScore.caregiverBurnout),
        factors: ['Reduced caregiver engagement', 'Stress markers detected', 'Delayed updates'],
        recommendation: 'Reach out to caregiver, offer support resources',
        priority: 'high',
      });
    }
    
    // Save insights
    for (const insight of insights) {
      await prisma.predictiveInsight.create({
        data: {
          patientId,
          patientName: riskScore.patientName,
          ...insight,
          factors: JSON.stringify(insight.factors),
          status: 'active',
          generatedAt: new Date(),
        },
      });
    }
    
    console.log(`Generated ${insights.length} predictive insights for patient ${patientId}`);
  } catch (error) {
    console.error(`Error generating predictive insights for patient ${patientId}:`, error);
  }
}

// Track caregiver engagement
export async function trackCaregiverEngagement(caregiverId: string, patientId: string): Promise<void> {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    // Count activities (placeholder - would query actual activity logs)
    const wellnessPlanUpdates = 5; // Would count actual updates
    const medicationLogs = 12;
    const mealPlanUpdates = 7;
    const vitalsRecorded = 6;
    const messagesExchanged = 8;
    
    // Calculate engagement score
    const totalActivities = wellnessPlanUpdates + medicationLogs + mealPlanUpdates + vitalsRecorded + messagesExchanged;
    const engagementScore = Math.min((totalActivities / 40) * 100, 100); // 40 activities per week = 100%
    
    let engagementLevel = 'high';
    if (engagementScore < 40) engagementLevel = 'low';
    else if (engagementScore < 70) engagementLevel = 'moderate';
    
    // Calculate burnout risk (inverse of engagement + stress factors)
    const burnoutRisk = 100 - engagementScore;
    
    // Get caregiver and patient names
    const caregiver = await prisma.caregiverProfile.findUnique({
      where: { id: caregiverId },
      include: { user: true },
    });
    
    const patient = await prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: { user: true },
    });
    
    if (!caregiver || !patient) return;
    
    // Save engagement data
    await prisma.caregiverEngagement.create({
      data: {
        caregiverId,
        caregiverName: caregiver.user.name,
        patientId,
        patientName: patient.user.name,
        engagementScore,
        engagementLevel,
        wellnessPlanUpdates,
        medicationLogs,
        mealPlanUpdates,
        vitalsRecorded,
        messagesExchanged,
        burnoutRisk,
        stressLevel: burnoutRisk > 70 ? 'high' : burnoutRisk > 40 ? 'moderate' : 'low',
        lastActivityAt: new Date(),
        weekStart,
      },
    });
    
    console.log(`Tracked caregiver engagement for ${caregiverId}`);
  } catch (error) {
    console.error(`Error tracking caregiver engagement:`, error);
  }
}

// Run full aggregation for all patients
export async function runFullAggregation(): Promise<void> {
  try {
    console.log('Starting full adherence aggregation...');
    
    // Get all patients
    const patients = await prisma.patientProfile.findMany();
    
    for (const patient of patients) {
      await aggregateAdherenceScores(patient.id);
      await calculatePatientRiskScore(patient.id);
      await generatePredictiveInsights(patient.id);
      
      // Track caregiver engagement if patient has a caregiver
      if (patient.caregiverId) {
        await trackCaregiverEngagement(patient.caregiverId, patient.id);
      }
    }
    
    console.log(`Completed aggregation for ${patients.length} patients`);
  } catch (error) {
    console.error('Error in full aggregation:', error);
  }
}

// Schedule aggregation to run daily
export function scheduleAggregation(): void {
  // Run every 24 hours
  setInterval(() => {
    runFullAggregation();
  }, 24 * 60 * 60 * 1000);
  
  // Run immediately on startup
  runFullAggregation();
}
