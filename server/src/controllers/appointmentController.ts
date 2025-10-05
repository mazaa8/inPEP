import { Response } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

// Get all appointments (filtered by user role)
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { startDate, endDate, status } = req.query;

    let whereClause: any = {};

    // Filter based on user role
    if (req.user.role === 'PATIENT') {
      whereClause.patientId = req.user.id;
    } else if (req.user.role === 'PROVIDER') {
      whereClause.providerId = req.user.id;
    } else if (req.user.role === 'CAREGIVER') {
      // Caregivers can see appointments for their patients
      // For now, we'll return all appointments (you can add patient relationship logic later)
      // whereClause = {}; // Get all for now
    }

    // Add date filters if provided
    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    // Add status filter if provided
    if (status) {
      whereClause.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'asc',
      },
    });

    res.status(200).json(appointments);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get appointments error:', error);
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }
};

// Get single appointment by ID
export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if user has access to this appointment
    const hasAccess =
      req.user.role === 'CAREGIVER' ||
      req.user.role === 'INSURER' ||
      appointment.patientId === req.user.id ||
      appointment.providerId === req.user.id;

    if (!hasAccess) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json(appointment);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get appointment error:', error);
      res.status(500).json({ error: 'Failed to fetch appointment' });
    }
  }
};

// Create new appointment
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const {
      patientId,
      patientName,
      providerId,
      providerName,
      title,
      description,
      specialty,
      appointmentType,
      startTime,
      endTime,
      duration,
      location,
      isVirtual,
      meetingLink,
      notes,
    } = req.body;

    // Validate required fields
    if (!patientId || !providerId || !title || !startTime || !endTime) {
      throw new AppError('Missing required fields', 400);
    }

    // Check if provider exists
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
    });

    if (!provider || provider.role !== 'PROVIDER') {
      throw new AppError('Invalid provider', 400);
    }

    // Check if patient exists
    const patient = await prisma.user.findUnique({
      where: { id: patientId },
    });

    if (!patient || patient.role !== 'PATIENT') {
      throw new AppError('Invalid patient', 400);
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        patientName: patientName || patient.name,
        providerId,
        providerName: providerName || provider.name,
        title,
        description,
        specialty,
        appointmentType,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: duration || 30,
        location,
        isVirtual: isVirtual || false,
        meetingLink,
        notes,
        createdBy: req.user.id,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Create appointment error:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }
};

// Update appointment
export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if appointment exists
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existingAppointment) {
      throw new AppError('Appointment not found', 404);
    }

    // Check if user can update this appointment
    const canUpdate =
      req.user.role === 'PROVIDER' && existingAppointment.providerId === req.user.id ||
      req.user.role === 'CAREGIVER';

    if (!canUpdate) {
      throw new AppError('Access denied', 403);
    }

    // Convert date strings to Date objects if present
    if (updateData.startTime) {
      updateData.startTime = new Date(updateData.startTime);
    }
    if (updateData.endTime) {
      updateData.endTime = new Date(updateData.endTime);
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(appointment);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Update appointment error:', error);
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  }
};

// Cancel appointment
export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { cancelReason } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelReason: cancelReason || 'No reason provided',
      },
    });

    res.status(200).json(appointment);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Cancel appointment error:', error);
      res.status(500).json({ error: 'Failed to cancel appointment' });
    }
  }
};

// Delete appointment
export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    // Only providers and caregivers can delete appointments
    if (req.user.role !== 'PROVIDER' && req.user.role !== 'CAREGIVER') {
      throw new AppError('Access denied', 403);
    }

    await prisma.appointment.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Delete appointment error:', error);
      res.status(500).json({ error: 'Failed to delete appointment' });
    }
  }
};
