import { Response } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';
import { AIInsightsGenerator } from '../utils/aiInsightsGenerator.js';

// Get health metrics for a patient
export const getHealthMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId, metricType, startDate, endDate } = req.query;

    // Determine which patient's data to fetch
    let targetPatientId: string;
    if (req.user.role === 'PATIENT') {
      targetPatientId = req.user.id;
    } else if (patientId) {
      targetPatientId = patientId as string;
    } else {
      throw new AppError('Patient ID required', 400);
    }

    const whereClause: any = {
      patientId: targetPatientId,
    };

    if (metricType) {
      whereClause.metricType = metricType;
    }

    if (startDate && endDate) {
      whereClause.recordedAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const metrics = await prisma.healthMetric.findMany({
      where: whereClause,
      orderBy: {
        recordedAt: 'desc',
      },
      take: 100, // Limit to last 100 readings
    });

    res.status(200).json(metrics);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get health metrics error:', error);
      res.status(500).json({ error: 'Failed to fetch health metrics' });
    }
  }
};

// Add a health metric
export const addHealthMetric = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId, metricType, value, unit, additionalData, notes, recordedAt } = req.body;

    // Validate required fields
    if (!metricType || value === undefined || !unit) {
      throw new AppError('Missing required fields', 400);
    }

    // Determine patient ID
    let targetPatientId: string;
    if (req.user.role === 'PATIENT') {
      targetPatientId = req.user.id;
    } else if (patientId) {
      targetPatientId = patientId;
    } else {
      throw new AppError('Patient ID required', 400);
    }

    const metric = await prisma.healthMetric.create({
      data: {
        patientId: targetPatientId,
        metricType,
        value: parseFloat(value),
        unit,
        additionalData: additionalData ? JSON.stringify(additionalData) : null,
        notes,
        recordedBy: req.user.id,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      },
    });

    res.status(201).json(metric);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Add health metric error:', error);
      res.status(500).json({ error: 'Failed to add health metric' });
    }
  }
};

// Generate AI insights for a patient
export const generateInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId } = req.params;

    // Determine which patient's insights to generate
    let targetPatientId: string;
    if (req.user.role === 'PATIENT') {
      targetPatientId = req.user.id;
    } else if (patientId) {
      targetPatientId = patientId;
    } else {
      throw new AppError('Patient ID required', 400);
    }

    // Fetch all metrics for the patient
    const allMetrics = await prisma.healthMetric.findMany({
      where: { patientId: targetPatientId },
      orderBy: { recordedAt: 'asc' },
    });

    // Group metrics by type
    const metricsByType = new Map<string, any[]>();
    allMetrics.forEach((metric) => {
      if (!metricsByType.has(metric.metricType)) {
        metricsByType.set(metric.metricType, []);
      }
      metricsByType.get(metric.metricType)!.push(metric);
    });

    // Generate insights using AI (including medication adherence)
    const generatedInsights = await AIInsightsGenerator.generateInsights(metricsByType, targetPatientId, prisma);

    // Delete old insights for this patient
    await prisma.healthInsight.deleteMany({
      where: {
        patientId: targetPatientId,
        generatedAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Older than 7 days
        },
      },
    });

    // Save new insights to database
    const savedInsights = await Promise.all(
      generatedInsights.map((insight) =>
        prisma.healthInsight.create({
          data: {
            patientId: targetPatientId,
            insightType: insight.insightType,
            category: insight.category,
            title: insight.title,
            description: insight.description,
            severity: insight.severity,
            confidence: insight.confidence,
            dataPoints: insight.dataPoints ? JSON.stringify(insight.dataPoints) : null,
          },
        })
      )
    );

    res.status(200).json(savedInsights);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Generate insights error:', error);
      res.status(500).json({ error: 'Failed to generate insights' });
    }
  }
};

// Get health insights for a patient
export const getHealthInsights = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { patientId } = req.query;

    // Determine which patient's insights to fetch
    let targetPatientId: string;
    if (req.user.role === 'PATIENT') {
      targetPatientId = req.user.id;
    } else if (patientId) {
      targetPatientId = patientId as string;
    } else {
      throw new AppError('Patient ID required', 400);
    }

    const insights = await prisma.healthInsight.findMany({
      where: {
        patientId: targetPatientId,
        isDismissed: false,
      },
      orderBy: [
        { severity: 'desc' },
        { generatedAt: 'desc' },
      ],
    });

    res.status(200).json(insights);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get health insights error:', error);
      res.status(500).json({ error: 'Failed to fetch health insights' });
    }
  }
};

// Mark insight as read
export const markInsightRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const insight = await prisma.healthInsight.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json(insight);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Mark insight read error:', error);
      res.status(500).json({ error: 'Failed to mark insight as read' });
    }
  }
};

// Dismiss insight
export const dismissInsight = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    const insight = await prisma.healthInsight.update({
      where: { id },
      data: { isDismissed: true },
    });

    res.status(200).json(insight);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Dismiss insight error:', error);
      res.status(500).json({ error: 'Failed to dismiss insight' });
    }
  }
};
