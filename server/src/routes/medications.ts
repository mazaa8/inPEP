import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get all medications (with search and filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { search, category, requiresPrescription } = req.query;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { genericName: { contains: search as string, mode: 'insensitive' } },
        { brandName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (requiresPrescription !== undefined) {
      where.requiresPrescription = requiresPrescription === 'true';
    }

    const medications = await prisma.medication.findMany({
      where,
      include: {
        alternatives: {
          include: {
            alternative: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

// Get medication by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await prisma.medication.findUnique({
      where: { id },
      include: {
        alternatives: {
          include: {
            alternative: true,
          },
        },
        interactions1: {
          include: {
            medication2: true,
          },
        },
        interactions2: {
          include: {
            medication1: true,
          },
        },
      },
    });

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    res.json(medication);
  } catch (error) {
    console.error('Error fetching medication:', error);
    res.status(500).json({ error: 'Failed to fetch medication' });
  }
});

// Get medication alternatives
router.get('/:id/alternatives', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const alternatives = await prisma.medicationAlternative.findMany({
      where: { medicationId: id },
      include: {
        alternative: true,
      },
    });

    res.json(alternatives);
  } catch (error) {
    console.error('Error fetching alternatives:', error);
    res.status(500).json({ error: 'Failed to fetch alternatives' });
  }
});

// Check drug interactions
router.post('/check-interactions', authenticate, async (req, res) => {
  try {
    const { medicationIds } = req.body;

    if (!Array.isArray(medicationIds) || medicationIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 medication IDs required' });
    }

    const interactions = await prisma.drugInteraction.findMany({
      where: {
        OR: medicationIds.flatMap((id1: string) =>
          medicationIds
            .filter((id2: string) => id2 !== id1)
            .map((id2: string) => ({
              AND: [
                { medication1Id: id1 },
                { medication2Id: id2 },
              ],
            }))
        ),
      },
      include: {
        medication1: true,
        medication2: true,
      },
      orderBy: {
        severity: 'desc',
      },
    });

    res.json(interactions);
  } catch (error) {
    console.error('Error checking interactions:', error);
    res.status(500).json({ error: 'Failed to check interactions' });
  }
});

// Search by barcode (NDC)
router.get('/barcode/:ndc', authenticate, async (req, res) => {
  try {
    const { ndc } = req.params;

    const medication = await prisma.medication.findUnique({
      where: { ndc },
      include: {
        alternatives: {
          include: {
            alternative: true,
          },
        },
      },
    });

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found for this barcode' });
    }

    res.json(medication);
  } catch (error) {
    console.error('Error searching by barcode:', error);
    res.status(500).json({ error: 'Failed to search by barcode' });
  }
});

// Create medication (admin/provider only)
router.post('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'PROVIDER' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only providers can create medications' });
    }

    const medication = await prisma.medication.create({
      data: req.body,
    });

    res.status(201).json(medication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ error: 'Failed to create medication' });
  }
});

export default router;
