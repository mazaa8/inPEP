import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get prescriptions for a patient
router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    const where: any = { patientId };
    if (status) {
      where.status = status;
    }

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        medication: true,
      },
      orderBy: { prescribedAt: 'desc' },
    });

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Get prescription by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        medication: true,
        refillRequests: {
          orderBy: { requestedAt: 'desc' },
        },
      },
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    return res.json(prescription);
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return res.status(500).json({ error: 'Failed to fetch prescription' });
  }
});

// Create prescription (provider only)
router.post('/', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'PROVIDER') {
      return res.status(403).json({ error: 'Only providers can create prescriptions' });
    }

    const {
      patientId,
      medicationId,
      dosage,
      frequency,
      duration,
      quantity,
      startDate,
      endDate,
      refillsAllowed,
      instructions,
      notes,
      pharmacyName,
      pharmacyPhone,
      pharmacyAddress,
    } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        providerId: user.id,
        medicationId,
        dosage,
        frequency,
        duration,
        quantity,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        refillsAllowed: refillsAllowed || 0,
        refillsRemaining: refillsAllowed || 0,
        status: 'active',
        instructions,
        notes,
        pharmacyName,
        pharmacyPhone,
        pharmacyAddress,
      },
      include: {
        medication: true,
      },
    });

    // Create initial stock entry
    await prisma.medicationStock.create({
      data: {
        patientId,
        medicationId,
        prescriptionId: prescription.id,
        currentStock: quantity,
        lastRefillDate: new Date(),
        pharmacyName,
        pharmacyPhone,
        pharmacyAddress,
      },
    });

    return res.status(201).json(prescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    return res.status(500).json({ error: 'Failed to create prescription' });
  }
});

// Request refill
router.post('/:id/refill', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const { pharmacyName, pharmacyPhone, notes } = req.body;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    if (prescription.refillsRemaining <= 0) {
      return res.status(400).json({ error: 'No refills remaining' });
    }

    const refillRequest = await prisma.refillRequest.create({
      data: {
        prescriptionId: id,
        requestedBy: user.id,
        status: 'pending',
        pharmacyName,
        pharmacyPhone,
        notes,
      },
    });

    return res.status(201).json(refillRequest);
  } catch (error) {
    console.error('Error requesting refill:', error);
    return res.status(500).json({ error: 'Failed to request refill' });
  }
});

// Approve refill (provider only)
router.patch('/refill/:refillId/approve', authenticate, async (req, res) => {
  try {
    const { refillId } = req.params;
    const user = (req as any).user;

    if (user.role !== 'PROVIDER') {
      return res.status(403).json({ error: 'Only providers can approve refills' });
    }

    const refillRequest = await prisma.refillRequest.update({
      where: { id: refillId },
      data: {
        status: 'approved',
        approvedBy: user.id,
        approvedAt: new Date(),
      },
      include: {
        prescription: true,
      },
    });

    // Decrement refills remaining
    await prisma.prescription.update({
      where: { id: refillRequest.prescriptionId },
      data: {
        refillsRemaining: {
          decrement: 1,
        },
      },
    });

    return res.json(refillRequest);
  } catch (error) {
    console.error('Error approving refill:', error);
    return res.status(500).json({ error: 'Failed to approve refill' });
  }
});

// Mark refill as filled
router.patch('/refill/:refillId/filled', authenticate, async (req, res) => {
  try {
    const { refillId } = req.params;
    const { quantity } = req.body;

    const refillRequest = await prisma.refillRequest.update({
      where: { id: refillId },
      data: {
        status: 'filled',
        filledAt: new Date(),
      },
      include: {
        prescription: true,
      },
    });

    // Update stock
    const stock = await prisma.medicationStock.findFirst({
      where: {
        patientId: refillRequest.prescription.patientId,
        medicationId: refillRequest.prescription.medicationId,
      },
    });

    if (stock) {
      await prisma.medicationStock.update({
        where: { id: stock.id },
        data: {
          currentStock: {
            increment: quantity || refillRequest.prescription.quantity,
          },
          lastRefillDate: new Date(),
        },
      });

      // Log refill in history
      await prisma.medicationHistory.create({
        data: {
          patientId: refillRequest.prescription.patientId,
          medicationId: refillRequest.prescription.medicationId,
          stockId: stock.id,
          action: 'refilled',
          notes: `Refilled ${quantity || refillRequest.prescription.quantity} doses`,
          recordedBy: 'system',
        },
      });
    }

    return res.json(refillRequest);
  } catch (error) {
    console.error('Error marking refill as filled:', error);
    return res.status(500).json({ error: 'Failed to mark refill as filled' });
  }
});

export default router;
