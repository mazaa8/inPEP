import express from 'express';
import { 
  createJournalEntry, 
  getJournalEntries, 
  shareJournalEntries,
  getSharedJournalEntries,
  markEntryAsReviewed,
  getJournalInsights
} from '../controllers/journalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:patientId', authenticate, getJournalEntries);
router.post('/', authenticate, createJournalEntry);
router.post('/share', authenticate, shareJournalEntries);
router.get('/shared/:providerId', authenticate, getSharedJournalEntries);
router.post('/review/:entryId', authenticate, markEntryAsReviewed);
router.get('/insights/:patientId', authenticate, getJournalInsights);

export default router;
