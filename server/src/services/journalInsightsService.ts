import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface JournalInsight {
  type: 'pattern' | 'risk' | 'recommendation' | 'trend';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  data: any;
  actionable: boolean;
  recommendation?: string;
}

export const analyzeJournalEntries = async (patientId: string): Promise<JournalInsight[]> => {
  const insights: JournalInsight[] = [];
  
  // Get entries from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const entries = await prisma.patientJournalEntry.findMany({
    where: {
      patientId,
      entryDate: { gte: thirtyDaysAgo },
    },
    orderBy: { entryDate: 'desc' },
  });

  if (entries.length === 0) return insights;

  // 1. Seizure Pattern Analysis
  const seizureInsights = analyzeSeizurePatterns(entries);
  insights.push(...seizureInsights);

  // 2. Fall Risk Analysis
  const fallInsights = analyzeFallRisks(entries);
  insights.push(...fallInsights);

  // 3. Mood Trend Analysis
  const moodInsights = analyzeMoodTrends(entries);
  insights.push(...moodInsights);

  // 4. Behavioral Pattern Analysis
  const behaviorInsights = analyzeBehavioralPatterns(entries);
  insights.push(...behaviorInsights);

  // 5. Medication Correlation Analysis
  const medicationInsights = analyzeMedicationCorrelations(entries);
  insights.push(...medicationInsights);

  return insights;
};

const analyzeSeizurePatterns = (entries: any[]): JournalInsight[] => {
  const insights: JournalInsight[] = [];
  const seizures = entries.filter(e => e.eventType === 'Seizure');

  if (seizures.length === 0) return insights;

  // Frequency analysis
  if (seizures.length >= 3) {
    const daysBetween = seizures.length > 1 
      ? (new Date(seizures[0].entryDate).getTime() - new Date(seizures[seizures.length - 1].entryDate).getTime()) / (1000 * 60 * 60 * 24)
      : 0;
    
    const frequency = daysBetween > 0 ? seizures.length / (daysBetween / 7) : 0;

    if (frequency > 1) {
      insights.push({
        type: 'risk',
        severity: frequency > 2 ? 'critical' : 'high',
        title: 'Increased Seizure Frequency',
        description: `${seizures.length} seizures recorded in the last ${Math.round(daysBetween)} days (${frequency.toFixed(1)} per week)`,
        data: { count: seizures.length, frequency, days: daysBetween },
        actionable: true,
        recommendation: 'Contact neurologist immediately. Consider medication adjustment or additional testing.',
      });
    }
  }

  // Trigger pattern analysis
  const triggers: Record<string, number> = {};
  seizures.forEach(seizure => {
    if (seizure.structuredDetails) {
      try {
        const details = JSON.parse(seizure.structuredDetails);
        if (details.triggers && Array.isArray(details.triggers)) {
          details.triggers.forEach((trigger: string) => {
            triggers[trigger] = (triggers[trigger] || 0) + 1;
          });
        }
      } catch (e) {}
    }
  });

  const commonTriggers = Object.entries(triggers)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (commonTriggers.length > 0) {
    insights.push({
      type: 'pattern',
      severity: 'medium',
      title: 'Common Seizure Triggers Identified',
      description: `Pattern detected: ${commonTriggers.map(([trigger, count]) => `${trigger} (${count}x)`).join(', ')}`,
      data: { triggers: Object.fromEntries(commonTriggers) },
      actionable: true,
      recommendation: `Focus on avoiding/managing: ${commonTriggers[0][0]}. Maintain consistent sleep schedule and medication adherence.`,
    });
  }

  // Severity trend
  const severities = seizures
    .map(s => {
      try {
        const details = JSON.parse(s.structuredDetails || '{}');
        return details.severity || 0;
      } catch {
        return 0;
      }
    })
    .filter(s => s > 0);

  if (severities.length >= 3) {
    const recentAvg = severities.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = severities.slice(3).reduce((a, b) => a + b, 0) / severities.slice(3).length;

    if (recentAvg > olderAvg + 1) {
      insights.push({
        type: 'trend',
        severity: 'high',
        title: 'Seizure Severity Increasing',
        description: `Recent seizures averaging ${recentAvg.toFixed(1)}/10 severity, up from ${olderAvg.toFixed(1)}/10`,
        data: { recentAvg, olderAvg, trend: 'increasing' },
        actionable: true,
        recommendation: 'Schedule urgent appointment with neurologist. Document all seizure details and triggers.',
      });
    }
  }

  return insights;
};

const analyzeFallRisks = (entries: any[]): JournalInsight[] => {
  const insights: JournalInsight[] = [];
  const falls = entries.filter(e => e.eventType === 'Fall');

  if (falls.length === 0) return insights;

  // Multiple falls = high risk
  if (falls.length >= 2) {
    insights.push({
      type: 'risk',
      severity: falls.length >= 3 ? 'high' : 'medium',
      title: 'Elevated Fall Risk',
      description: `${falls.length} falls recorded in the last 30 days`,
      data: { count: falls.length },
      actionable: true,
      recommendation: 'Implement fall prevention measures: remove tripping hazards, install grab bars, improve lighting, consider walker/cane.',
    });
  }

  // Environmental factor analysis
  const locations: Record<string, number> = {};
  const factors: Record<string, number> = {};

  falls.forEach(fall => {
    if (fall.structuredDetails) {
      try {
        const details = JSON.parse(fall.structuredDetails);
        if (details.location) {
          locations[details.location] = (locations[details.location] || 0) + 1;
        }
        if (details.environmentalFactors && Array.isArray(details.environmentalFactors)) {
          details.environmentalFactors.forEach((factor: string) => {
            factors[factor] = (factors[factor] || 0) + 1;
          });
        }
      } catch (e) {}
    }
  });

  const commonLocation = Object.entries(locations).sort((a, b) => b[1] - a[1])[0];
  if (commonLocation && commonLocation[1] >= 2) {
    insights.push({
      type: 'pattern',
      severity: 'medium',
      title: 'Fall Location Pattern',
      description: `${commonLocation[1]} falls occurred in ${commonLocation[0]}`,
      data: { location: commonLocation[0], count: commonLocation[1] },
      actionable: true,
      recommendation: `Focus safety improvements on ${commonLocation[0]}: add non-slip mats, improve lighting, remove obstacles.`,
    });
  }

  return insights;
};

const analyzeMoodTrends = (entries: any[]): JournalInsight[] => {
  const insights: JournalInsight[] = [];
  const moodEntries = entries.filter(e => e.mood);

  if (moodEntries.length < 5) return insights;

  const moodScores: Record<string, number> = {
    happy: 5,
    neutral: 3,
    sad: 2,
    angry: 1,
    anxious: 1,
  };

  const recentMoods = moodEntries.slice(0, 7).map(e => moodScores[e.mood.toLowerCase()] || 3);
  const olderMoods = moodEntries.slice(7, 14).map(e => moodScores[e.mood.toLowerCase()] || 3);

  if (recentMoods.length >= 5 && olderMoods.length >= 5) {
    const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    const olderAvg = olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length;

    if (recentAvg < olderAvg - 0.5) {
      insights.push({
        type: 'trend',
        severity: recentAvg < 2 ? 'high' : 'medium',
        title: 'Declining Mood Trend',
        description: 'Patient mood has been declining over the past week',
        data: { recentAvg, olderAvg, trend: 'declining' },
        actionable: true,
        recommendation: 'Monitor for depression symptoms. Consider mental health consultation. Increase social engagement activities.',
      });
    }
  }

  // Negative mood frequency
  const negativeMoods = moodEntries.filter(e => ['sad', 'angry', 'anxious'].includes(e.mood.toLowerCase()));
  if (negativeMoods.length / moodEntries.length > 0.6) {
    insights.push({
      type: 'risk',
      severity: 'high',
      title: 'Persistent Negative Mood',
      description: `${Math.round((negativeMoods.length / moodEntries.length) * 100)}% of recent entries show negative mood`,
      data: { percentage: (negativeMoods.length / moodEntries.length) * 100 },
      actionable: true,
      recommendation: 'Urgent: Schedule mental health evaluation. Consider therapy or counseling services.',
    });
  }

  return insights;
};

const analyzeBehavioralPatterns = (entries: any[]): JournalInsight[] => {
  const insights: JournalInsight[] = [];
  const behaviorChanges = entries.filter(e => e.eventType === 'Behavioral Change');

  if (behaviorChanges.length >= 3) {
    const behaviors: Record<string, number> = {};
    
    behaviorChanges.forEach(entry => {
      if (entry.structuredDetails) {
        try {
          const details = JSON.parse(entry.structuredDetails);
          if (details.behaviors && Array.isArray(details.behaviors)) {
            details.behaviors.forEach((behavior: string) => {
              behaviors[behavior] = (behaviors[behavior] || 0) + 1;
            });
          }
        } catch (e) {}
      }
    });

    const recurring = Object.entries(behaviors).filter(([_, count]) => count >= 2);
    if (recurring.length > 0) {
      insights.push({
        type: 'pattern',
        severity: 'medium',
        title: 'Recurring Behavioral Patterns',
        description: `Repeated behaviors: ${recurring.map(([b, c]) => `${b} (${c}x)`).join(', ')}`,
        data: { behaviors: Object.fromEntries(recurring) },
        actionable: true,
        recommendation: 'Document triggers and effective interventions. Consider behavioral therapy consultation.',
      });
    }
  }

  return insights;
};

const analyzeMedicationCorrelations = (entries: any[]): JournalInsight[] => {
  const insights: JournalInsight[] = [];
  
  // Check for "Missed medication" trigger in seizures
  const seizures = entries.filter(e => e.eventType === 'Seizure');
  const missedMedSeizures = seizures.filter(s => {
    try {
      const details = JSON.parse(s.structuredDetails || '{}');
      return details.triggers?.includes('Missed medication');
    } catch {
      return false;
    }
  });

  if (missedMedSeizures.length >= 2) {
    insights.push({
      type: 'risk',
      severity: 'critical',
      title: 'Medication Adherence Critical',
      description: `${missedMedSeizures.length} seizures linked to missed medications`,
      data: { count: missedMedSeizures.length },
      actionable: true,
      recommendation: 'URGENT: Implement medication reminders, pill organizer, or caregiver supervision. Contact doctor about adherence strategies.',
    });
  }

  return insights;
};
