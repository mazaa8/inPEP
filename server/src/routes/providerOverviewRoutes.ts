import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get patient overview metrics for provider dashboard
router.get('/:providerId/overview', authenticate, async (req, res) => {
  try {
    const { providerId } = req.params;

    console.log('Fetching overview for provider:', providerId);

    // Get all patient profiles
    const patientProfiles = await prisma.patientProfile.findMany({
      include: {
        user: true,
      },
    });

    const activePatients = patientProfiles.length;
    const patientIds = patientProfiles.map(p => p.userId);

    // Get latest risk scores from AI Adherence system
    const allRiskScores = await prisma.patientRiskScore.findMany({
      where: {
        patientId: { in: patientIds },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get only the latest risk score per patient
    const latestRiskScores = new Map();
    allRiskScores.forEach(score => {
      if (!latestRiskScores.has(score.patientId)) {
        latestRiskScores.set(score.patientId, score);
      }
    });

    // Calculate risk alerts
    const riskAlerts = { high: 0, medium: 0, low: 0 };
    let readmissionHighRisk = 0;

    patientIds.forEach(patientId => {
      const riskScore = latestRiskScores.get(patientId);
      if (riskScore) {
        // Categorize by risk level
        if (riskScore.riskLevel === 'CRITICAL' || riskScore.riskLevel === 'HIGH') {
          riskAlerts.high++;
        } else if (riskScore.riskLevel === 'MEDIUM') {
          riskAlerts.medium++;
        } else {
          riskAlerts.low++;
        }

        // Count readmission risk
        if (riskScore.readmissionRisk && riskScore.readmissionRisk > 0.6) {
          readmissionHighRisk++;
        }
      } else {
        // No risk data = assume low risk
        riskAlerts.low++;
      }
    });

    // Get caregiver engagement from AI Adherence system
    const caregiverEngagements = await prisma.caregiverEngagement.findMany({
      where: {
        caregiverId: {
          in: patientProfiles
            .filter(p => p.caregiverId)
            .map(p => p.caregiverId as string),
        },
      },
      orderBy: { weekStart: 'desc' },
    });

    // Get latest engagement per caregiver
    const latestEngagements = new Map();
    caregiverEngagements.forEach(eng => {
      if (!latestEngagements.has(eng.caregiverId)) {
        latestEngagements.set(eng.caregiverId, eng);
      }
    });

    // Categorize caregiver engagement
    const caregiverEngagement = { highlyEngaged: 0, moderatelyEngaged: 0, lowEngagement: 0 };
    latestEngagements.forEach(eng => {
      if (eng.engagementScore >= 80) {
        caregiverEngagement.highlyEngaged++;
      } else if (eng.engagementScore >= 50) {
        caregiverEngagement.moderatelyEngaged++;
      } else {
        caregiverEngagement.lowEngagement++;
      }
    });

    const result = {
      activePatients,
      riskAlerts,
      readmissionRisk: {
        highRisk: readmissionHighRisk,
        total: activePatients,
      },
      caregiverEngagement,
    };

    console.log('Returning overview data:', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching provider overview:', error);
    res.status(500).json({ error: 'Failed to fetch provider overview metrics' });
  }
});

export default router;
