import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Create new patient admission
router.post('/create', authenticate, async (req, res) => {
  try {
    const {
      patientName,
      email,
      dateOfBirth,
      phoneNumber,
      address,
      bloodType,
      allergies,
      chronicConditions,
      emergencyContact,
      admissionDate,
      admissionReason,
      assignedCaregiver,
    } = req.body;

    // Validate required fields
    if (!patientName || !email || !dateOfBirth) {
      return res.status(400).json({ error: 'Patient name, email, and date of birth are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Create user account for patient
    const hashedPassword = await bcrypt.hash('Welcome123!', 10); // Default password
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: patientName,
        role: 'PATIENT',
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber: phoneNumber || null,
        address: address || null,
      },
    });

    // Create patient profile
    const patientProfile = await prisma.patientProfile.create({
      data: {
        userId: user.id,
        medicalRecordNumber: `MRN-${user.id.substring(0, 8).toUpperCase()}`,
        bloodType: bloodType || null,
        allergies: allergies ? JSON.stringify(allergies) : null,
        chronicConditions: chronicConditions ? JSON.stringify(chronicConditions) : null,
        emergencyContact: emergencyContact || null,
        primaryProviderId: req.user!.id, // Assign to the provider creating the admission
      },
    });

    // Create admission record (using appointment as admission tracker)
    const admission = await prisma.appointment.create({
      data: {
        patientId: user.id,
        patientName: user.name,
        providerId: req.user!.id,
        providerName: req.user!.name,
        title: 'Patient Admission',
        appointmentType: 'Admission',
        startTime: admissionDate ? new Date(admissionDate) : new Date(),
        endTime: admissionDate ? new Date(new Date(admissionDate).getTime() + 60 * 60 * 1000) : new Date(Date.now() + 60 * 60 * 1000),
        duration: 60,
        status: 'SCHEDULED',
        notes: admissionReason || 'New patient admission',
        createdBy: req.user!.id,
      },
    });

    // If caregiver is assigned, create caregiver profile link
    if (assignedCaregiver) {
      // This would link to an existing caregiver or create a new one
      // For now, we'll just note it in the patient profile
      await prisma.patientProfile.update({
        where: { userId: user.id },
        data: {
          emergencyContact: emergencyContact 
            ? `${emergencyContact} | Caregiver: ${assignedCaregiver}`
            : `Caregiver: ${assignedCaregiver}`,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient admitted successfully',
      patient: {
        id: user.id,
        name: user.name,
        email: user.email,
        medicalRecordNumber: patientProfile.medicalRecordNumber,
        admissionId: admission.id,
      },
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    res.status(500).json({ error: 'Failed to create patient admission' });
  }
});

// Get all admissions for a provider
router.get('/list', authenticate, async (req, res) => {
  try {
    const providerId = req.user!.id;

    const admissions = await prisma.appointment.findMany({
      where: {
        providerId,
        appointmentType: 'Admission',
      },
      orderBy: {
        startTime: 'desc',
      },
      take: 50,
    });

    res.json(admissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ error: 'Failed to fetch admissions' });
  }
});

export default router;
