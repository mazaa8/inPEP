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

export const shareJournalEntries = async (req: Request, res: Response) => {
  try {
    const { entryIds, sharedNote } = req.body;
    const result = await journalService.shareJournalEntries(entryIds, sharedNote);
    res.status(200).json({ message: 'Entries shared successfully', count: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to share journal entries' });
  }
};

export const getSharedJournalEntries = async (req: Request, res: Response) => {
  try {
    const { providerId } = req.params;
    const entries = await journalService.getSharedJournalEntries(providerId);
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve shared journal entries' });
  }
};

export const markEntryAsReviewed = async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;
    const { providerNotes } = req.body;
    const entry = await journalService.markEntryAsReviewed(entryId, providerNotes);
    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark entry as reviewed' });
  }
};
