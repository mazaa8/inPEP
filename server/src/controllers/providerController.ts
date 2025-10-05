import { Response } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

// Get all providers
export const getProviders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providers = await prisma.user.findMany({
      where: {
        role: 'PROVIDER',
        isActive: true,
      },
      include: {
        providerProfile: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedProviders = providers.map((provider) => ({
      id: provider.id,
      name: provider.name,
      email: provider.email,
      specialty: provider.providerProfile?.specialty || 'General',
      department: provider.providerProfile?.clinicName || 'inPEP Medical Center',
      licenseNumber: provider.providerProfile?.licenseNumber,
    }));

    res.status(200).json(formattedProviders);
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
};
