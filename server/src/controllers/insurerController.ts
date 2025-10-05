import { Response } from 'express';
import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

// Get insurer dashboard overview
export const getDashboardOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'INSURER') {
      throw new AppError('Unauthorized', 401);
    }

    // Get total members (patients)
    const totalMembers = await prisma.user.count({
      where: { role: 'PATIENT', isActive: true },
    });

    // Get total claims
    const totalClaims = await prisma.claim.count();
    const pendingClaims = await prisma.claim.count({
      where: { status: 'PENDING' },
    });
    const approvedClaims = await prisma.claim.count({
      where: { status: 'APPROVED' },
    });

    // Calculate total costs
    const claimsData = await prisma.claim.findMany({
      select: {
        claimedAmount: true,
        approvedAmount: true,
        status: true,
      },
    });

    const totalClaimedAmount = claimsData.reduce((sum, c) => sum + c.claimedAmount, 0);
    const totalApprovedAmount = claimsData
      .filter(c => c.approvedAmount)
      .reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
    const costSavings = totalClaimedAmount - totalApprovedAmount;

    // Get high-risk patients
    const highRiskPatients = await prisma.riskAssessment.count({
      where: { riskLevel: { in: ['HIGH', 'CRITICAL'] } },
    });

    // Get active providers
    const activeProviders = await prisma.user.count({
      where: { role: 'PROVIDER', isActive: true },
    });

    res.status(200).json({
      totalMembers,
      totalClaims,
      pendingClaims,
      approvedClaims,
      totalClaimedAmount,
      totalApprovedAmount,
      costSavings,
      highRiskPatients,
      activeProviders,
      averageClaimAmount: totalClaims > 0 ? totalClaimedAmount / totalClaims : 0,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get dashboard overview error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard overview' });
    }
  }
};

// Get claims list
export const getClaims = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'INSURER') {
      throw new AppError('Unauthorized', 401);
    }

    const { status, startDate, endDate, limit = '50' } = req.query;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.serviceDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const claims = await prisma.claim.findMany({
      where: whereClause,
      orderBy: { submittedDate: 'desc' },
      take: parseInt(limit as string),
    });

    res.status(200).json(claims);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get claims error:', error);
      res.status(500).json({ error: 'Failed to fetch claims' });
    }
  }
};

// Get risk assessments
export const getRiskAssessments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'INSURER') {
      throw new AppError('Unauthorized', 401);
    }

    const { riskLevel, limit = '50' } = req.query;

    const whereClause: any = {};

    if (riskLevel) {
      whereClause.riskLevel = riskLevel;
    }

    const assessments = await prisma.riskAssessment.findMany({
      where: whereClause,
      orderBy: { overallRiskScore: 'desc' },
      take: parseInt(limit as string),
    });

    res.status(200).json(assessments);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get risk assessments error:', error);
      res.status(500).json({ error: 'Failed to fetch risk assessments' });
    }
  }
};

// Get population health metrics
export const getPopulationHealth = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'INSURER') {
      throw new AppError('Unauthorized', 401);
    }

    // Get all patients
    const totalPatients = await prisma.user.count({
      where: { role: 'PATIENT', isActive: true },
    });

    // Get patients with health metrics
    const patientsWithMetrics = await prisma.healthMetric.groupBy({
      by: ['patientId'],
    });

    // Get average metrics by type
    const avgBloodPressure = await prisma.healthMetric.aggregate({
      where: { metricType: 'BLOOD_PRESSURE' },
      _avg: { value: true },
    });

    const avgGlucose = await prisma.healthMetric.aggregate({
      where: { metricType: 'GLUCOSE' },
      _avg: { value: true },
    });

    const avgWeight = await prisma.healthMetric.aggregate({
      where: { metricType: 'WEIGHT' },
      _avg: { value: true },
    });

    // Get health insights distribution
    const insightsByCategory = await prisma.healthInsight.groupBy({
      by: ['category', 'severity'],
      _count: true,
    });

    res.status(200).json({
      totalPatients,
      patientsTracking: patientsWithMetrics.length,
      trackingPercentage: (patientsWithMetrics.length / totalPatients) * 100,
      averageMetrics: {
        bloodPressure: avgBloodPressure._avg.value,
        glucose: avgGlucose._avg.value,
        weight: avgWeight._avg.value,
      },
      insightsByCategory,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get population health error:', error);
      res.status(500).json({ error: 'Failed to fetch population health data' });
    }
  }
};

// Get cost analytics
export const getCostAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'INSURER') {
      throw new AppError('Unauthorized', 401);
    }

    const { startDate, endDate } = req.query;

    const whereClause: any = {};

    if (startDate && endDate) {
      whereClause.serviceDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    // Get claims by type
    const claimsByType = await prisma.claim.groupBy({
      by: ['claimType'],
      where: whereClause,
      _sum: {
        claimedAmount: true,
        approvedAmount: true,
      },
      _count: true,
    });

    // Get claims by status
    const claimsByStatus = await prisma.claim.groupBy({
      by: ['status'],
      where: whereClause,
      _sum: {
        claimedAmount: true,
        approvedAmount: true,
      },
      _count: true,
    });

    // Get high-cost claims
    const highCostClaims = await prisma.claim.findMany({
      where: {
        ...whereClause,
        isHighCost: true,
      },
      orderBy: { claimedAmount: 'desc' },
      take: 10,
    });

    // Calculate preventive care savings
    const preventiveCareAppointments = await prisma.appointment.count({
      where: {
        appointmentType: 'Checkup',
        status: 'COMPLETED',
      },
    });

    // Estimate savings (each preventive visit saves ~$1000 in future costs)
    const estimatedPreventiveSavings = preventiveCareAppointments * 1000;

    res.status(200).json({
      claimsByType,
      claimsByStatus,
      highCostClaims,
      preventiveCareAppointments,
      estimatedPreventiveSavings,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Get cost analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch cost analytics' });
    }
  }
};
