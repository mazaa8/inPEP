import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJournalEntries = async (patientId: string) => {
  return prisma.patientJournalEntry.findMany({
    where: { patientId },
    orderBy: { entryDate: 'desc' },
  });
};

export const createJournalEntry = async (data: any) => {
  return prisma.patientJournalEntry.create({ data });
};

export const shareJournalEntries = async (entryIds: string[], sharedNote?: string) => {
  return prisma.patientJournalEntry.updateMany({
    where: { id: { in: entryIds } },
    data: {
      sharedWithProvider: true,
      sharedAt: new Date(),
      sharedNote,
    },
  });
};

export const getSharedJournalEntries = async (providerId: string) => {
  // Get all patients under this provider's care
  const patients = await prisma.patientProfile.findMany({
    where: { primaryProviderId: providerId },
    select: { userId: true },
  });

  const patientIds = patients.map(p => p.userId);

  // If provider has assigned patients, show only their entries
  // Otherwise, show all shared entries (for demo/testing)
  const whereClause = patientIds.length > 0 
    ? { patientId: { in: patientIds }, sharedWithProvider: true }
    : { sharedWithProvider: true };

  return prisma.patientJournalEntry.findMany({
    where: whereClause,
    include: {
      patient: { select: { name: true, email: true } },
      caregiver: { select: { name: true } },
    },
    orderBy: { sharedAt: 'desc' },
  });
};

export const markEntryAsReviewed = async (entryId: string, providerNotes?: string) => {
  return prisma.patientJournalEntry.update({
    where: { id: entryId },
    data: {
      providerReviewedAt: new Date(),
      providerNotes,
    },
  });
};
