import express from 'express';
import { createJournalEntry, getJournalEntries } from '../controllers/journalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:patientId', authenticate, getJournalEntries);
router.post('/', authenticate, createJournalEntry);

export default router;
