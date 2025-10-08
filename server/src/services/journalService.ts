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
