import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAdherenceData() {
  console.log('🌱 Seeding adherence tracking data...');

  try {
    // Get existing patients
    const patients = await prisma.patientProfile.findMany({
      include: { user: true },
      take: 5,
    });

    if (patients.length === 0) {
      console.log('⚠️  No patients found. Please seed users first.');
      return;
    }

    console.log(`Found ${patients.length} patients to seed data for`);

    for (const patient of patients) {
      const patientId = patient.id;
      const patientName = patient.user.name;

      // Create adherence scores for the last 7 days
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

        const medicationScore = 85 + Math.random() * 15;
        const mealPlanScore = 80 + Math.random() * 15;
        const vitalsScore = 85 + Math.random() * 15;
        const moodScore = 75 + Math.random() * 20;
        const exerciseScore = 70 + Math.random() * 20;
        const sleepScore = 75 + Math.random() * 20;

        const overallScore = (
          medicationScore * 0.3 +
          mealPlanScore * 0.2 +
          vitalsScore * 0.2 +
          moodScore * 0.15 +
          exerciseScore * 0.075 +
          sleepScore * 0.075
        );

        await prisma.adherenceScore.create({
          data: {
            patientId,
            patientName,
            overallScore,
            medicationScore,
            mealPlanScore,
            vitalsScore,
            moodScore,
            exerciseScore,
            sleepScore,
            trend: Math.random() > 0.5 ? 'up' : 'down',
            weeklyChange: (Math.random() - 0.5) * 10,
            date,
            weekStart,
            dataPointsCount: Math.floor(Math.random() * 50) + 20,
            confidence: 0.8 + Math.random() * 0.15,
          },
        });
      }

      // Create patient risk score
      const healthScore = Math.floor(60 + Math.random() * 35);
      let riskLevel = 'low';
      if (healthScore < 50) riskLevel = 'critical';
      else if (healthScore < 65) riskLevel = 'high';
      else if (healthScore < 80) riskLevel = 'medium';

      await prisma.patientRiskScore.create({
        data: {
          patientId,
          patientName,
          healthScore,
          riskLevel,
          adherenceRate: healthScore + Math.random() * 10,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          riskFactors: JSON.stringify(
            riskLevel === 'high' || riskLevel === 'critical'
              ? ['Low medication adherence', 'Irregular vitals tracking']
              : ['None identified']
          ),
          protectiveFactors: JSON.stringify(['Regular caregiver engagement', 'Good meal plan adherence']),
          readmissionRisk: riskLevel === 'high' ? 65 : 30,
          medicationRisk: riskLevel === 'high' ? 70 : 25,
          caregiverBurnout: Math.random() * 40,
          assessmentDate: new Date(),
        },
      });

      // Create behavior pattern
      await prisma.behaviorPattern.create({
        data: {
          patientId,
          medicationScore: 85 + Math.random() * 15,
          mealPlanScore: 80 + Math.random() * 15,
          exerciseScore: 70 + Math.random() * 20,
          sleepScore: 75 + Math.random() * 20,
          moodScore: 75 + Math.random() * 20,
          vitalsScore: 85 + Math.random() * 15,
          date: new Date(),
          periodType: 'daily',
        },
      });

      // Create predictive insights for high-risk patients
      if (riskLevel === 'high' || riskLevel === 'critical') {
        await prisma.predictiveInsight.create({
          data: {
            patientId,
            patientName,
            predictionType: 'medication_nonadherence',
            prediction: 'High risk of medication non-adherence in next 48 hours',
            confidence: 80 + Math.random() * 15,
            factors: JSON.stringify(['Declining adherence trend', 'Missed doses this week']),
            recommendation: 'Schedule check-in call, consider medication reminder adjustment',
            priority: 'high',
            status: 'active',
            generatedAt: new Date(),
          },
        });
      }

      // Create caregiver engagement if patient has a caregiver
      if (patient.caregiverId) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

        const engagementScore = 60 + Math.random() * 35;
        let engagementLevel = 'high';
        if (engagementScore < 40) engagementLevel = 'low';
        else if (engagementScore < 70) engagementLevel = 'moderate';

        await prisma.caregiverEngagement.create({
          data: {
            caregiverId: patient.caregiverId,
            caregiverName: 'Caregiver Name', // Would fetch from database
            patientId,
            patientName,
            engagementScore,
            engagementLevel,
            wellnessPlanUpdates: Math.floor(Math.random() * 10),
            medicationLogs: Math.floor(Math.random() * 20),
            mealPlanUpdates: Math.floor(Math.random() * 15),
            vitalsRecorded: Math.floor(Math.random() * 10),
            messagesExchanged: Math.floor(Math.random() * 15),
            burnoutRisk: 100 - engagementScore,
            stressLevel: engagementScore < 50 ? 'high' : engagementScore < 70 ? 'moderate' : 'low',
            lastActivityAt: new Date(),
            weekStart,
          },
        });
      }

      console.log(`✅ Seeded adherence data for patient: ${patientName}`);
    }

    console.log('🎉 Adherence tracking data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding adherence data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAdherenceData();
