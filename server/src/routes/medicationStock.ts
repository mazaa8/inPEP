import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get stock for a patient
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;

    const stocks = await prisma.medicationStock.findMany({
      where: { patientId },
      include: {
        medication: true,
        prescription: true,
      },
      orderBy: { currentStock: 'asc' }, // Low stock first
    });

    res.json(stocks);
  } catch (error) {
    console.error('Error fetching medication stock:', error);
    res.status(500).json({ error: 'Failed to fetch medication stock' });
  }
});

// Get low stock alerts
router.get('/patient/:patientId/low-stock', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;

    const lowStockMeds = await prisma.medicationStock.findMany({
      where: {
        patientId,
        currentStock: {
          lte: prisma.medicationStock.fields.lowStockThreshold,
        },
      },
      include: {
        medication: true,
        prescription: true,
      },
      orderBy: { currentStock: 'asc' },
    });

    res.json(lowStockMeds);
  } catch (error) {
    console.error('Error fetching low stock:', error);
    res.status(500).json({ error: 'Failed to fetch low stock alerts' });
  }
});

// Update stock (when medication is taken)
router.post('/update', authenticate, async (req, res) => {
  try {
    const { stockId, change, action, notes } = req.body;

    const stock = await prisma.medicationStock.findUnique({
      where: { id: stockId },
      include: { medication: true },
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const newStock = Math.max(0, stock.currentStock + change);

    const updatedStock = await prisma.medicationStock.update({
      where: { id: stockId },
      data: {
        currentStock: newStock,
      },
      include: {
        medication: true,
      },
    });

    // Log the action
    await prisma.medicationHistory.create({
      data: {
        patientId: stock.patientId,
        medicationId: stock.medicationId,
        stockId: stock.id,
        action: action || (change < 0 ? 'taken' : 'added'),
        notes,
        recordedBy: (req as any).user.id,
      },
    });

    return res.json(updatedStock);
  } catch (error) {
    console.error('Error updating stock:', error);
    return res.status(500).json({ error: 'Failed to update stock' });
  }
});

// Log medication taken
router.post('/log-dose', authenticate, async (req, res) => {
  try {
    const { patientId, medicationId, dosageTaken, notes } = req.body;

    const stock = await prisma.medicationStock.findFirst({
      where: {
        patientId,
        medicationId,
      },
    });

    if (stock) {
      // Decrement stock
      await prisma.medicationStock.update({
        where: { id: stock.id },
        data: {
          currentStock: {
            decrement: 1,
          },
        },
      });
    }

    // Log in history
    const history = await prisma.medicationHistory.create({
      data: {
        patientId,
        medicationId,
        stockId: stock?.id,
        action: 'taken',
        dosageTaken,
        notes,
        recordedBy: (req as any).user.id,
      },
    });

    res.status(201).json(history);
  } catch (error) {
    console.error('Error logging dose:', error);
    res.status(500).json({ error: 'Failed to log dose' });
  }
});

// Log missed dose
router.post('/log-missed', authenticate, async (req, res) => {
  try {
    const { patientId, medicationId, notes } = req.body;

    const history = await prisma.medicationHistory.create({
      data: {
        patientId,
        medicationId,
        action: 'missed',
        notes,
        recordedBy: 'system',
      },
    });

    res.status(201).json(history);
  } catch (error) {
    console.error('Error logging missed dose:', error);
    res.status(500).json({ error: 'Failed to log missed dose' });
  }
});

// Get adherence rate
router.get('/patient/:patientId/adherence', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medicationId, startDate, endDate } = req.query;

    const where: any = {
      patientId,
      action: { in: ['taken', 'missed'] },
    };

    if (medicationId) {
      where.medicationId = medicationId;
    }

    if (startDate) {
      where.timestamp = { gte: new Date(startDate as string) };
    }

    if (endDate) {
      where.timestamp = { ...where.timestamp, lte: new Date(endDate as string) };
    }

    const history = await prisma.medicationHistory.findMany({
      where,
    });

    const taken = history.filter((h) => h.action === 'taken').length;
    const missed = history.filter((h) => h.action === 'missed').length;
    const total = taken + missed;

    const adherenceRate = total > 0 ? (taken / total) * 100 : 0;

    res.json({
      adherenceRate: Math.round(adherenceRate * 10) / 10,
      taken,
      missed,
      total,
    });
  } catch (error) {
    console.error('Error calculating adherence:', error);
    res.status(500).json({ error: 'Failed to calculate adherence' });
  }
});

// Get medication history
router.get('/patient/:patientId/history', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { medicationId, action, limit = 50 } = req.query;

    const where: any = { patientId };

    if (medicationId) {
      where.medicationId = medicationId;
    }

    if (action) {
      where.action = action;
    }

    const history = await prisma.medicationHistory.findMany({
      where,
      include: {
        medication: true,
      },
      orderBy: { timestamp: 'desc' },
      take: Number(limit),
    });

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch medication history' });
  }
});

export default router;
