import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';

const router = Router();

// Get EMR sync status
router.get('/sync-status', authenticate, async (_req, res) => {
  try {
    // Simulate EMR sync status
    const syncStatus = {
      isSynced: true,
      lastSync: new Date().toISOString(),
      nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      syncInterval: '5 minutes',
      connectedSystems: ['Epic EMR', 'HL7 FHIR', 'Lab Systems'],
      totalRecordsSynced: 1247,
      lastSyncDuration: '2.3 seconds',
    };

    res.json(syncStatus);
  } catch (error) {
    console.error('Error fetching EMR sync status:', error);
    res.status(500).json({ error: 'Failed to fetch sync status' });
  }
});

// Get all patients with EMR data for a provider
router.get('/patients', authenticate, async (req, res) => {
  try {
    const providerId = req.query.providerId as string;

    if (!providerId) {
      return res.status(400).json({ error: 'Provider ID is required' });
    }

    // Fetch all patients assigned to this provider
    const patients = await prisma.patientProfile.findMany({
      where: {
        primaryProviderId: providerId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform data to include EMR-specific information
    const emrPatients = patients.map(patient => ({
      id: patient.userId,
      name: patient.user.name,
      email: patient.user.email,
      medicalRecordNumber: patient.medicalRecordNumber || `MRN-${patient.userId.substring(0, 8).toUpperCase()}`,
      dateOfBirth: patient.user.dateOfBirth,
      bloodType: patient.bloodType || 'Unknown',
      allergies: patient.allergies ? JSON.parse(patient.allergies) : [],
      chronicConditions: patient.chronicConditions ? JSON.parse(patient.chronicConditions) : [],
      lastUpdated: patient.updatedAt,
      emrLink: `/provider/patients/${patient.userId}/emr`,
    }));

    res.json(emrPatients);
  } catch (error) {
    console.error('Error fetching EMR patients:', error);
    res.status(500).json({ error: 'Failed to fetch patient EMR data' });
  }
});

// Get detailed EMR data for a specific patient
router.get('/patients/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await prisma.patientProfile.findFirst({
      where: {
        userId: patientId,
      },
      include: {
        user: true,
      },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Fetch additional EMR data
    const [healthMetrics, appointments] = await Promise.all([
      prisma.healthMetric.findMany({
        where: { patientId },
        orderBy: { recordedAt: 'desc' },
        take: 10,
      }),
      prisma.appointment.findMany({
        where: { patientId },
        orderBy: { startTime: 'desc' },
        take: 5,
      }),
    ]);

    const emrData = {
      patient: {
        id: patient.userId,
        name: patient.user.name,
        email: patient.user.email,
        dateOfBirth: patient.user.dateOfBirth,
        phoneNumber: patient.user.phoneNumber,
        address: patient.user.address,
        medicalRecordNumber: patient.medicalRecordNumber || `MRN-${patient.userId.substring(0, 8).toUpperCase()}`,
        bloodType: patient.bloodType || 'Unknown',
        allergies: patient.allergies ? JSON.parse(patient.allergies) : [],
        chronicConditions: patient.chronicConditions ? JSON.parse(patient.chronicConditions) : [],
        emergencyContact: patient.emergencyContact,
      },
      healthMetrics: healthMetrics.map(metric => ({
        id: metric.id,
        type: metric.metricType,
        value: metric.value,
        unit: metric.unit,
        recordedAt: metric.recordedAt,
        notes: metric.notes,
      })),
      appointments: appointments.map(apt => ({
        id: apt.id,
        date: apt.startTime,
        type: apt.appointmentType,
        status: apt.status,
        notes: apt.notes,
      })),
      lastUpdated: patient.updatedAt,
    };

    res.json(emrData);
  } catch (error) {
    console.error('Error fetching patient EMR data:', error);
    res.status(500).json({ error: 'Failed to fetch patient EMR data' });
  }
});

// Trigger manual EMR sync
router.post('/sync', authenticate, async (_req, res) => {
  try {
    // Simulate EMR sync process
    const syncResult = {
      success: true,
      syncedAt: new Date().toISOString(),
      recordsSynced: Math.floor(Math.random() * 50) + 10,
      duration: `${(Math.random() * 3 + 1).toFixed(1)} seconds`,
      message: 'EMR data synchronized successfully',
    };

    res.json(syncResult);
  } catch (error) {
    console.error('Error syncing EMR data:', error);
    res.status(500).json({ error: 'Failed to sync EMR data' });
  }
});

export default router;
