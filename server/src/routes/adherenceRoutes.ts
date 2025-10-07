import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get overall adherence dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const providerId = req.query.providerId as string;
    
    // Get all patients for this provider (simplified - would need proper patient-provider relationship)
    const patients = await prisma.patientProfile.findMany({
      where: { primaryProviderId: providerId },
      include: { user: true },
    });
    
    const patientIds = patients.map(p => p.id);
    
    // Get latest adherence scores
    const adherenceScores = await prisma.adherenceScore.findMany({
      where: { patientId: { in: patientIds } },
      orderBy: { date: 'desc' },
      take: patientIds.length,
    });
    
    // Calculate overall metrics
    const overallScore = adherenceScores.length > 0
      ? adherenceScores.reduce((sum, s) => sum + s.overallScore, 0) / adherenceScores.length
      : 0;
    
    // Get high risk patients
    const highRiskPatients = await prisma.patientRiskScore.findMany({
      where: {
        patientId: { in: patientIds },
        riskLevel: { in: ['high', 'critical'] },
      },
      orderBy: { assessmentDate: 'desc' },
    });
    
    // Get active predictions
    const activePredictions = await prisma.predictiveInsight.findMany({
      where: {
        patientId: { in: patientIds },
        status: 'active',
      },
    });
    
    // Get data points count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dataPointsCount = await prisma.adherenceDataPoint.count({
      where: {
        patientId: { in: patientIds },
        timestamp: { gte: sevenDaysAgo },
      },
    });
    
    res.json({
      overallScore: Math.round(overallScore),
      highRiskCount: highRiskPatients.length,
      activePredictionsCount: activePredictions.length,
      dataPointsCount,
      trend: 'up', // Would calculate from historical data
      weeklyChange: 5, // Would calculate from historical data
    });
  } catch (error) {
    console.error('Error fetching adherence dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch adherence dashboard data' });
  }
});

// Get weekly adherence trends
router.get('/trends/weekly', async (req, res) => {
  try {
    const patientId = req.query.patientId as string;
    
    // Get last 7 days of adherence scores
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const scores = await prisma.adherenceScore.findMany({
      where: {
        patientId,
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'asc' },
    });
    
    // Format for chart
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map((day, index) => {
      const score = scores[index] || {
        medicationScore: 0,
        mealPlanScore: 0,
        vitalsScore: 0,
        moodScore: 0,
        overallScore: 0,
      };
      
      return {
        date: day,
        medication: Math.round(score.medicationScore),
        mealPlan: Math.round(score.mealPlanScore),
        vitals: Math.round(score.vitalsScore),
        mood: Math.round(score.moodScore),
        overall: Math.round(score.overallScore),
      };
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching weekly trends:', error);
    res.status(500).json({ error: 'Failed to fetch weekly trends' });
  }
});

// Get patient risk scores
router.get('/risk-scores', async (req, res) => {
  try {
    const providerId = req.query.providerId as string;
    
    // Get all patients (for demo purposes, show all if no valid provider ID)
    const patients = providerId && providerId !== 'provider-id' && providerId !== 'test'
      ? await prisma.patientProfile.findMany({
          where: { primaryProviderId: providerId },
          include: { user: true },
        })
      : await prisma.patientProfile.findMany({
          include: { user: true },
          take: 101, // Get all 101 patients
        });
    
    const patientIds = patients.map(p => p.id);
    
    // Get latest risk scores for each patient
    const riskScores = await prisma.patientRiskScore.findMany({
      where: { patientId: { in: patientIds } },
      orderBy: { assessmentDate: 'desc' },
    });
    
    // Group by patient and get latest
    const latestScores = new Map();
    riskScores.forEach(score => {
      if (!latestScores.has(score.patientId)) {
        latestScores.set(score.patientId, score);
      }
    });
    
    const result = Array.from(latestScores.values()).map(score => ({
      id: score.patientId,
      name: score.patientName,
      score: score.healthScore,
      risk: score.riskLevel,
      trend: score.trend,
      adherence: Math.round(score.adherenceRate),
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching risk scores:', error);
    res.status(500).json({ error: 'Failed to fetch risk scores' });
  }
});

// Get predictive insights
router.get('/insights/predictive', async (req, res) => {
  try {
    const providerId = req.query.providerId as string;
    
    // Get all patients for this provider
    const patients = await prisma.patientProfile.findMany({
      where: { primaryProviderId: providerId },
    });
    
    const patientIds = patients.map(p => p.id);
    
    // Get active insights
    const insights = await prisma.predictiveInsight.findMany({
      where: {
        patientId: { in: patientIds },
        status: 'active',
      },
      orderBy: [
        { priority: 'desc' },
        { confidence: 'desc' },
      ],
      take: 10,
    });
    
    const result = insights.map(insight => ({
      patient: insight.patientName,
      prediction: insight.prediction,
      confidence: Math.round(insight.confidence),
      factors: JSON.parse(insight.factors),
      recommendation: insight.recommendation,
      priority: insight.priority,
    }));
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching predictive insights:', error);
    res.status(500).json({ error: 'Failed to fetch predictive insights' });
  }
});

// Get behavior patterns
router.get('/behavior-patterns', async (req, res) => {
  try {
    const patientId = req.query.patientId as string;
    
    // Get latest behavior pattern
    const pattern = await prisma.behaviorPattern.findFirst({
      where: { patientId },
      orderBy: { date: 'desc' },
    });
    
    if (!pattern) {
      return res.json([]);
    }
    
    const data = [
      { behavior: 'Medication', score: Math.round(pattern.medicationScore), fullMark: 100 },
      { behavior: 'Meal Plan', score: Math.round(pattern.mealPlanScore), fullMark: 100 },
      { behavior: 'Exercise', score: Math.round(pattern.exerciseScore), fullMark: 100 },
      { behavior: 'Sleep', score: Math.round(pattern.sleepScore), fullMark: 100 },
      { behavior: 'Mood', score: Math.round(pattern.moodScore), fullMark: 100 },
      { behavior: 'Vitals', score: Math.round(pattern.vitalsScore), fullMark: 100 },
    ];
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching behavior patterns:', error);
    res.status(500).json({ error: 'Failed to fetch behavior patterns' });
  }
});

// Acknowledge an insight
router.post('/insights/:id/acknowledge', async (req, res) => {
  try {
    const { id } = req.params;
    const { providerId, actionTaken } = req.body;
    
    const insight = await prisma.predictiveInsight.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy: providerId,
        acknowledgedAt: new Date(),
        actionTaken,
      },
    });
    
    res.json(insight);
  } catch (error) {
    console.error('Error acknowledging insight:', error);
    res.status(500).json({ error: 'Failed to acknowledge insight' });
  }
});

export default router;
