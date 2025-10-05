import { Router } from 'express';
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all appointments (filtered by user role)
router.get('/', getAppointments);

// Get single appointment
router.get('/:id', getAppointmentById);

// Create new appointment
router.post('/', createAppointment);

// Update appointment
router.put('/:id', updateAppointment);

// Cancel appointment
router.patch('/:id/cancel', cancelAppointment);

// Delete appointment
router.delete('/:id', deleteAppointment);

export default router;
