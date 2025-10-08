import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all caregiver engagement data for a provider
router.get('/', authenticate, async (req, res) => {
  try {
    const providerId = req.query.providerId as string;

    // Get all caregiver engagement records
    // In production, filter by provider's patients
    const caregiverEngagements = await prisma.caregiverEngagement.findMany({
      orderBy: [
        { engagementLevel: 'asc' }, // low first (for alerts)
        { burnoutRisk: 'desc' }, // high burnout risk first
      ],
    });

    // Calculate summary metrics
    const totalCaregivers = caregiverEngagements.length;
    const avgEngagement = totalCaregivers > 0
      ? Math.round(caregiverEngagements.reduce((sum, c) => sum + c.engagementScore, 0) / totalCaregivers)
      : 0;
    const atRiskCount = caregiverEngagements.filter(c => c.burnoutRisk >= 60).length;
    const activeThisWeek = caregiverEngagements.filter(c => {
      if (!c.lastActivityAt) return false;
      const daysSinceActivity = (Date.now() - c.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActivity <= 7;
    }).length;

    res.json({
      summary: {
        totalCaregivers,
        avgEngagement,
        atRiskCount,
        activeThisWeek,
      },
      caregivers: caregiverEngagements.map(c => {
        // Parse flagged status from stressFactors JSON
        let flagged = false;
        try {
          if (c.stressFactors) {
            const factors = JSON.parse(c.stressFactors);
            flagged = factors.flagged === true;
          }
        } catch (e) {
          // Invalid JSON, ignore
        }

        return {
          id: c.id,
          caregiverId: c.caregiverId, // Actual user ID for video calls
          caregiverName: c.caregiverName,
          patientId: c.patientId,
          patientName: c.patientName,
          relationship: 'Family Caregiver', // TODO: Add relationship field to schema
          engagementScore: c.engagementScore,
          engagementLevel: c.engagementLevel,
          burnoutRisk: c.burnoutRisk,
          lastActivity: c.lastActivityAt 
            ? formatLastActivity(c.lastActivityAt)
            : 'No recent activity',
          trend: c.engagementScore >= 70 ? 'up' : 'down',
          flagged,
          activities: {
            medicationLogs: c.medicationLogs,
            mealUpdates: c.mealPlanUpdates,
            vitalsRecorded: c.vitalsRecorded,
            messagesExchanged: c.messagesExchanged,
            wellnessPlanUpdates: c.wellnessPlanUpdates,
          },
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching caregiver engagement:', error);
    res.status(500).json({ error: 'Failed to fetch caregiver engagement data' });
  }
});

// Helper function to format last activity time
function formatLastActivity(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

// Flag/unflag a caregiver for follow-up
router.post('/:id/flag', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { flagged } = req.body;

    const caregiverEngagement = await prisma.caregiverEngagement.update({
      where: { id },
      data: {
        // Add flagged field to track priority caregivers
        // For now, we'll use a JSON field or add it to schema later
        stressFactors: flagged 
          ? JSON.stringify({ flagged: true, flaggedAt: new Date().toISOString() })
          : null,
      },
    });

    res.json({ 
      success: true, 
      flagged,
      message: flagged ? 'Caregiver flagged for follow-up' : 'Flag removed'
    });
  } catch (error) {
    console.error('Error flagging caregiver:', error);
    res.status(500).json({ error: 'Failed to flag caregiver' });
  }
});

export default router;
