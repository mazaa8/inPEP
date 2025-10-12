import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as healthTimelineService from '../services/healthTimelineService.js';

const router = express.Router();

/**
 * GET /api/health-timeline/:patientId
 * Get unified health timeline for a patient
 */
router.get('/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
    const end = endDate ? new Date(endDate as string) : new Date(); // Default: now

    const timeline = await healthTimelineService.getHealthTimeline(patientId, start, end);

    res.status(200).json(timeline);
  } catch (error) {
    console.error('Error fetching health timeline:', error);
    res.status(500).json({ error: 'Failed to fetch health timeline' });
  }
});

/**
 * GET /api/health-timeline/:patientId/correlations
 * Find correlations between journal events and other health data
 */
router.get('/:patientId/correlations', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();

    const correlations = await healthTimelineService.findHealthCorrelations(patientId, start, end);

    res.status(200).json(correlations);
  } catch (error) {
    console.error('Error finding health correlations:', error);
    res.status(500).json({ error: 'Failed to find correlations' });
  }
});

/**
 * GET /api/health-timeline/journal/:journalEntryId/related
 * Get related health events for a specific journal entry
 */
router.get('/journal/:journalEntryId/related', authenticate, async (req, res) => {
  try {
    const { journalEntryId } = req.params;

    const relatedEvents = await healthTimelineService.linkJournalToHealthEvents(journalEntryId);

    res.status(200).json(relatedEvents);
  } catch (error) {
    console.error('Error fetching related health events:', error);
    res.status(500).json({ error: 'Failed to fetch related events' });
  }
});

export default router;
