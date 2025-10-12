import { apiRequest } from '../config/api';

export interface JournalEntry {
  id: string;
  patientId: string;
  caregiverId: string;
  entryDate: string;
  title: string;
  eventType: string;
  mood?: string;
  content: string;
  structuredDetails?: string; // JSON string
  tags?: string; // Comma-separated string
  isVisibleToPatient: boolean;
  sharedWithProvider: boolean;
  sharedAt?: string;
  sharedNote?: string;
  providerReviewedAt?: string;
  providerNotes?: string;
}

export const journalService = {
  getJournalEntries: (patientId: string): Promise<JournalEntry[]> => {
    return apiRequest<JournalEntry[]>(`/journal/${patientId}`);
  },

  createJournalEntry: (entryData: Partial<JournalEntry>): Promise<JournalEntry> => {
    return apiRequest<JournalEntry>('/journal', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  },

  shareJournalEntries: (entryIds: string[], sharedNote?: string): Promise<{ message: string; count: number }> => {
    return apiRequest('/journal/share', {
      method: 'POST',
      body: JSON.stringify({ entryIds, sharedNote }),
    });
  },

  getSharedJournalEntries: (providerId: string): Promise<JournalEntry[]> => {
    return apiRequest<JournalEntry[]>(`/journal/shared/${providerId}`);
  },

  markEntryAsReviewed: (entryId: string, providerNotes?: string): Promise<JournalEntry> => {
    return apiRequest<JournalEntry>(`/journal/review/${entryId}`, {
      method: 'POST',
      body: JSON.stringify({ providerNotes }),
    });
  },
};
