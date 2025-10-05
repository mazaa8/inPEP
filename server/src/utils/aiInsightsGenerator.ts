// AI-powered health insights generator
// This simulates AI analysis of health metrics to generate actionable insights

interface HealthMetric {
  id: string;
  metricType: string;
  value: number;
  additionalData?: string;
  recordedAt: Date;
}

interface GeneratedInsight {
  insightType: 'TREND' | 'RISK' | 'RECOMMENDATION' | 'ACHIEVEMENT';
  category: 'CARDIOVASCULAR' | 'DIABETES' | 'WEIGHT' | 'GENERAL';
  title: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  confidence: number;
  dataPoints?: string[];
}

export class AIInsightsGenerator {
  // Analyze blood pressure trends
  static analyzeBloodPressure(metrics: HealthMetric[]): GeneratedInsight[] {
    const insights: GeneratedInsight[] = [];
    
    if (metrics.length < 3) return insights;

    const recentMetrics = metrics.slice(-7); // Last 7 readings
    const avgSystolic = recentMetrics.reduce((sum, m) => {
      const data = m.additionalData ? JSON.parse(m.additionalData) : {};
      return sum + (data.systolic || 0);
    }, 0) / recentMetrics.length;

    const avgDiastolic = recentMetrics.reduce((sum, m) => {
      const data = m.additionalData ? JSON.parse(m.additionalData) : {};
      return sum + (data.diastolic || 0);
    }, 0) / recentMetrics.length;

    // High blood pressure alert
    if (avgSystolic > 140 || avgDiastolic > 90) {
      insights.push({
        insightType: 'RISK',
        category: 'CARDIOVASCULAR',
        title: 'Elevated Blood Pressure Detected',
        description: `Your average blood pressure over the last 7 readings is ${Math.round(avgSystolic)}/${Math.round(avgDiastolic)} mmHg, which is above the normal range. Consider consulting your healthcare provider.`,
        severity: avgSystolic > 160 ? 'ALERT' : 'WARNING',
        confidence: 0.92,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    // Improving trend
    if (metrics.length >= 10) {
      const older = metrics.slice(-10, -5);
      const newer = metrics.slice(-5);
      
      const oldAvg = older.reduce((sum, m) => {
        const data = m.additionalData ? JSON.parse(m.additionalData) : {};
        return sum + (data.systolic || 0);
      }, 0) / older.length;

      const newAvg = newer.reduce((sum, m) => {
        const data = m.additionalData ? JSON.parse(m.additionalData) : {};
        return sum + (data.systolic || 0);
      }, 0) / newer.length;

      if (oldAvg - newAvg > 5) {
        insights.push({
          insightType: 'ACHIEVEMENT',
          category: 'CARDIOVASCULAR',
          title: 'Blood Pressure Improving!',
          description: `Great news! Your blood pressure has decreased by an average of ${Math.round(oldAvg - newAvg)} mmHg over the past readings. Keep up the good work!`,
          severity: 'INFO',
          confidence: 0.88,
          dataPoints: [...older, ...newer].map(m => m.id),
        });
      }
    }

    return insights;
  }

  // Analyze heart rate patterns
  static analyzeHeartRate(metrics: HealthMetric[]): GeneratedInsight[] {
    const insights: GeneratedInsight[] = [];
    
    if (metrics.length < 5) return insights;

    const recentMetrics = metrics.slice(-10);
    const avgHeartRate = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;

    // Resting heart rate analysis
    if (avgHeartRate < 60) {
      insights.push({
        insightType: 'TREND',
        category: 'CARDIOVASCULAR',
        title: 'Low Resting Heart Rate',
        description: `Your average resting heart rate is ${Math.round(avgHeartRate)} bpm. This could indicate good cardiovascular fitness, but consult your doctor if you experience dizziness or fatigue.`,
        severity: avgHeartRate < 50 ? 'WARNING' : 'INFO',
        confidence: 0.85,
        dataPoints: recentMetrics.map(m => m.id),
      });
    } else if (avgHeartRate > 100) {
      insights.push({
        insightType: 'RISK',
        category: 'CARDIOVASCULAR',
        title: 'Elevated Resting Heart Rate',
        description: `Your average resting heart rate is ${Math.round(avgHeartRate)} bpm, which is above the normal range. Consider discussing this with your healthcare provider.`,
        severity: 'WARNING',
        confidence: 0.87,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    return insights;
  }

  // Analyze weight trends
  static analyzeWeight(metrics: HealthMetric[]): GeneratedInsight[] {
    const insights: GeneratedInsight[] = [];
    
    if (metrics.length < 5) return insights;

    const recentMetrics = metrics.slice(-30); // Last 30 readings
    const firstWeight = recentMetrics[0].value;
    const lastWeight = recentMetrics[recentMetrics.length - 1].value;
    const weightChange = lastWeight - firstWeight;
    const percentChange = (weightChange / firstWeight) * 100;

    // Significant weight loss
    if (weightChange < -5 && percentChange < -5) {
      insights.push({
        insightType: 'TREND',
        category: 'WEIGHT',
        title: 'Significant Weight Loss Detected',
        description: `You've lost ${Math.abs(weightChange).toFixed(1)} kg (${Math.abs(percentChange).toFixed(1)}%) over recent measurements. If unintentional, please consult your healthcare provider.`,
        severity: percentChange < -10 ? 'WARNING' : 'INFO',
        confidence: 0.90,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    // Significant weight gain
    if (weightChange > 5 && percentChange > 5) {
      insights.push({
        insightType: 'TREND',
        category: 'WEIGHT',
        title: 'Weight Gain Observed',
        description: `You've gained ${weightChange.toFixed(1)} kg (${percentChange.toFixed(1)}%) over recent measurements. Consider reviewing your diet and exercise routine with your healthcare provider.`,
        severity: 'INFO',
        confidence: 0.90,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    // Stable weight (achievement)
    if (Math.abs(percentChange) < 2 && recentMetrics.length >= 20) {
      insights.push({
        insightType: 'ACHIEVEMENT',
        category: 'WEIGHT',
        title: 'Stable Weight Maintained',
        description: `Excellent! You've maintained a stable weight with less than 2% variation over ${recentMetrics.length} measurements. Consistency is key to good health!`,
        severity: 'INFO',
        confidence: 0.85,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    return insights;
  }

  // Analyze glucose levels
  static analyzeGlucose(metrics: HealthMetric[]): GeneratedInsight[] {
    const insights: GeneratedInsight[] = [];
    
    if (metrics.length < 3) return insights;

    const recentMetrics = metrics.slice(-14); // Last 14 readings
    const avgGlucose = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;

    // High glucose levels
    if (avgGlucose > 126) {
      insights.push({
        insightType: 'RISK',
        category: 'DIABETES',
        title: 'Elevated Blood Glucose Levels',
        description: `Your average fasting blood glucose is ${Math.round(avgGlucose)} mg/dL, which is above the normal range. This may indicate prediabetes or diabetes. Please consult your healthcare provider.`,
        severity: avgGlucose > 140 ? 'ALERT' : 'WARNING',
        confidence: 0.93,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    // Well-controlled glucose
    if (avgGlucose >= 70 && avgGlucose <= 100) {
      insights.push({
        insightType: 'ACHIEVEMENT',
        category: 'DIABETES',
        title: 'Blood Glucose Well Controlled',
        description: `Great job! Your average blood glucose level is ${Math.round(avgGlucose)} mg/dL, which is within the healthy range. Keep up the good work!`,
        severity: 'INFO',
        confidence: 0.88,
        dataPoints: recentMetrics.map(m => m.id),
      });
    }

    return insights;
  }

  // Generate general health recommendations
  static generateRecommendations(allMetrics: Map<string, HealthMetric[]>): GeneratedInsight[] {
    const insights: GeneratedInsight[] = [];

    // Check if user is tracking multiple metrics
    const trackedMetrics = Array.from(allMetrics.keys());
    if (trackedMetrics.length >= 3) {
      insights.push({
        insightType: 'ACHIEVEMENT',
        category: 'GENERAL',
        title: 'Excellent Health Tracking!',
        description: `You're actively monitoring ${trackedMetrics.length} different health metrics. Consistent tracking is a key factor in maintaining good health and catching potential issues early.`,
        severity: 'INFO',
        confidence: 0.95,
      });
    }

    // Recommend adding more metrics
    if (trackedMetrics.length < 3) {
      insights.push({
        insightType: 'RECOMMENDATION',
        category: 'GENERAL',
        title: 'Expand Your Health Monitoring',
        description: 'Consider tracking additional metrics like blood pressure, weight, and heart rate for a more complete picture of your health.',
        severity: 'INFO',
        confidence: 0.80,
      });
    }

    return insights;
  }

  // Main function to generate all insights
  static generateInsights(metricsByType: Map<string, HealthMetric[]>): GeneratedInsight[] {
    const allInsights: GeneratedInsight[] = [];

    // Analyze each metric type
    const bpMetrics = metricsByType.get('BLOOD_PRESSURE') || [];
    const hrMetrics = metricsByType.get('HEART_RATE') || [];
    const weightMetrics = metricsByType.get('WEIGHT') || [];
    const glucoseMetrics = metricsByType.get('GLUCOSE') || [];

    allInsights.push(...this.analyzeBloodPressure(bpMetrics));
    allInsights.push(...this.analyzeHeartRate(hrMetrics));
    allInsights.push(...this.analyzeWeight(weightMetrics));
    allInsights.push(...this.analyzeGlucose(glucoseMetrics));
    allInsights.push(...this.generateRecommendations(metricsByType));

    return allInsights;
  }
}
