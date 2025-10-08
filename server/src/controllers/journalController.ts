import { Request, Response } from 'express';
import * as journalService from '../services/journalService.js';

export const getJournalEntries = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const entries = await journalService.getJournalEntries(patientId);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve journal entries' });
  }
};

export const createJournalEntry = async (req: Request, res: Response) => {
  try {
    const entry = await journalService.createJournalEntry(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
};
