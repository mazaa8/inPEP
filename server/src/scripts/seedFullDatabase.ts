import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample names for realistic data
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Shirley', 'Eric', 'Angela', 'Jonathan', 'Helen', 'Stephen', 'Anna',
  'Larry', 'Brenda', 'Justin', 'Pamela', 'Scott', 'Nicole', 'Brandon', 'Emma',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Alexander', 'Rachel', 'Patrick', 'Catherine', 'Frank', 'Carolyn', 'Jack', 'Janet',
  'Dennis', 'Ruth', 'Jerry', 'Maria', 'Tyler', 'Heather', 'Aaron', 'Diane'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen',
  'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
  'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz',
  'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook',
  'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed',
  'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson'
];

const conditions = [
  'Hypertension', 'Diabetes Type 2', 'Heart Disease', 'Arthritis', 'COPD',
  'Asthma', 'Depression', 'Anxiety', 'Osteoporosis', 'Chronic Pain'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomName(): string {
  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedFullDatabase() {
  console.log('🌱 Starting comprehensive database seeding...');
  console.log('⚠️  Keeping existing patient: Abdeen White');

  try {
    // Get existing patient (Abdeen White)
    const existingPatient = await prisma.patientProfile.findFirst({
      include: { user: true },
    });

    if (!existingPatient) {
      console.log('❌ Abdeen White not found! Please run initial seed first.');
      return;
    }

    console.log(`✅ Found existing patient: ${existingPatient.user.name}`);

    // Get all providers
    const providers = await prisma.providerProfile.findMany({
      include: { user: true },
    });

    console.log(`✅ Found ${providers.length} providers`);

    // Create 99 more patients (total 100 including Abdeen White)
    console.log('\n📝 Creating 99 new patients with caregivers...');

    // Simple password hash for demo purposes
    const hashedPassword = '$2b$10$YourHashedPasswordHere';

    const timestamp = Date.now();
    
    for (let i = 0; i < 99; i++) {
      const patientName = getRandomName();
      const caregiverName = getRandomName();
      const randomProvider = getRandomElement(providers);

      // Create patient user
      const patientUser = await prisma.user.create({
        data: {
          email: `patient${timestamp}_${i + 2}@example.com`,
          passwordHash: hashedPassword,
          name: patientName,
          role: 'PATIENT',
          phoneNumber: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          dateOfBirth: getRandomDate(new Date(1940, 0, 1), new Date(1990, 11, 31)),
          isActive: true,
        },
      });

      // Create caregiver user
      const caregiverUser = await prisma.user.create({
        data: {
          email: `caregiver${timestamp}_${i + 2}@example.com`,
          passwordHash: hashedPassword,
          name: caregiverName,
          role: 'CAREGIVER',
          phoneNumber: `555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          isActive: true,
        },
      });

      // Create caregiver profile
      const caregiverProfile = await prisma.caregiverProfile.create({
        data: {
          userId: caregiverUser.id,
          relationshipType: getRandomElement(['Spouse', 'Child', 'Professional Caregiver', 'Sibling', 'Friend']),
        },
      });

      // Create patient profile
      const patientProfile = await prisma.patientProfile.create({
        data: {
          userId: patientUser.id,
          medicalRecordNumber: `MRN${String(timestamp + i).padStart(13, '0')}`,
          bloodType: getRandomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
          allergies: JSON.stringify([getRandomElement(['Penicillin', 'Sulfa', 'Aspirin', 'None'])]),
          chronicConditions: JSON.stringify([
            getRandomElement(conditions),
            Math.random() > 0.5 ? getRandomElement(conditions) : null,
          ].filter(Boolean)),
          caregiverId: caregiverProfile.id,
          primaryProviderId: randomProvider.id,
        },
      });

      // Create adherence scores for last 7 days
      const today = new Date();
      for (let day = 6; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(date.getDate() - day);
        
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

        const medicationScore = 70 + Math.random() * 30;
        const mealPlanScore = 65 + Math.random() * 30;
        const vitalsScore = 75 + Math.random() * 25;
        const moodScore = 60 + Math.random() * 35;
        const exerciseScore = 55 + Math.random() * 35;
        const sleepScore = 65 + Math.random() * 30;

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
            patientId: patientProfile.id,
            patientName: patientUser.name,
            overallScore,
            medicationScore,
            mealPlanScore,
            vitalsScore,
            moodScore,
            exerciseScore,
            sleepScore,
            trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
            weeklyChange: (Math.random() - 0.5) * 15,
            date,
            weekStart,
            dataPointsCount: Math.floor(Math.random() * 50) + 20,
            confidence: 0.75 + Math.random() * 0.2,
          },
        });
      }

      // Create patient risk score
      const healthScore = Math.floor(45 + Math.random() * 50);
      let riskLevel = 'low';
      if (healthScore < 50) riskLevel = 'critical';
      else if (healthScore < 65) riskLevel = 'high';
      else if (healthScore < 80) riskLevel = 'medium';

      const riskFactors = [];
      if (healthScore < 70) {
        riskFactors.push('Low medication adherence');
        riskFactors.push('Irregular vitals tracking');
      }
      if (healthScore < 60) {
        riskFactors.push('Declining mood scores');
        riskFactors.push('Poor meal plan adherence');
      }

      await prisma.patientRiskScore.create({
        data: {
          patientId: patientProfile.id,
          patientName: patientUser.name,
          healthScore,
          riskLevel,
          adherenceRate: healthScore + Math.random() * 10,
          trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable',
          riskFactors: JSON.stringify(riskFactors.length > 0 ? riskFactors : ['None identified']),
          protectiveFactors: JSON.stringify(['Regular caregiver engagement', 'Good meal plan adherence']),
          readmissionRisk: riskLevel === 'high' || riskLevel === 'critical' ? 60 + Math.random() * 30 : 20 + Math.random() * 30,
          medicationRisk: riskLevel === 'high' || riskLevel === 'critical' ? 65 + Math.random() * 25 : 15 + Math.random() * 30,
          caregiverBurnout: Math.random() * 60,
          assessmentDate: new Date(),
        },
      });

      // Create behavior pattern
      await prisma.behaviorPattern.create({
        data: {
          patientId: patientProfile.id,
          medicationScore: 70 + Math.random() * 30,
          mealPlanScore: 65 + Math.random() * 30,
          exerciseScore: 55 + Math.random() * 35,
          sleepScore: 65 + Math.random() * 30,
          moodScore: 60 + Math.random() * 35,
          vitalsScore: 75 + Math.random() * 25,
          date: new Date(),
          periodType: 'daily',
        },
      });

      // Create predictive insights for high-risk patients
      if (riskLevel === 'high' || riskLevel === 'critical') {
        const predictions = [
          {
            type: 'medication_nonadherence',
            prediction: 'High risk of medication non-adherence in next 48 hours',
            factors: ['Declining adherence trend', 'Missed doses this week', 'Low engagement'],
            recommendation: 'Schedule check-in call, consider medication reminder adjustment',
          },
          {
            type: 'readmission',
            prediction: 'Potential hospital readmission risk within 7 days',
            factors: ['Low medication adherence', 'Irregular vitals tracking', 'High risk score'],
            recommendation: 'Urgent: Schedule in-person visit, review care plan',
          },
        ];

        const prediction = getRandomElement(predictions);
        await prisma.predictiveInsight.create({
          data: {
            patientId: patientProfile.id,
            patientName: patientUser.name,
            predictionType: prediction.type,
            prediction: prediction.prediction,
            confidence: 75 + Math.random() * 20,
            factors: JSON.stringify(prediction.factors),
            recommendation: prediction.recommendation,
            priority: riskLevel === 'critical' ? 'urgent' : 'high',
            status: 'active',
            generatedAt: new Date(),
          },
        });
      }

      // Create caregiver engagement
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

      const engagementScore = 50 + Math.random() * 45;
      let engagementLevel = 'high';
      if (engagementScore < 40) engagementLevel = 'low';
      else if (engagementScore < 70) engagementLevel = 'moderate';

      await prisma.caregiverEngagement.create({
        data: {
          caregiverId: caregiverProfile.id,
          caregiverName: caregiverUser.name,
          patientId: patientProfile.id,
          patientName: patientUser.name,
          engagementScore,
          engagementLevel,
          wellnessPlanUpdates: Math.floor(Math.random() * 15),
          medicationLogs: Math.floor(Math.random() * 25),
          mealPlanUpdates: Math.floor(Math.random() * 20),
          vitalsRecorded: Math.floor(Math.random() * 15),
          messagesExchanged: Math.floor(Math.random() * 20),
          burnoutRisk: 100 - engagementScore,
          stressLevel: engagementScore < 50 ? 'high' : engagementScore < 70 ? 'moderate' : 'low',
          lastActivityAt: new Date(),
          weekStart,
        },
      });

      // Create some health metrics
      for (let j = 0; j < 10; j++) {
        const daysAgo = Math.floor(Math.random() * 7);
        const recordedAt = new Date();
        recordedAt.setDate(recordedAt.getDate() - daysAgo);

        await prisma.healthMetric.create({
          data: {
            patientId: patientProfile.id,
            metricType: getRandomElement(['BLOOD_PRESSURE', 'HEART_RATE', 'WEIGHT', 'GLUCOSE', 'OXYGEN_SATURATION']),
            value: 120 + Math.random() * 40,
            unit: 'mmHg',
            recordedAt,
            source: 'MANUAL',
          },
        });
      }

      if ((i + 1) % 10 === 0) {
        console.log(`   ✅ Created ${i + 1}/99 patients with full data...`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Final Statistics:');
    
    const totalPatients = await prisma.patientProfile.count();
    const totalCaregivers = await prisma.caregiverProfile.count();
    const totalProviders = await prisma.providerProfile.count();
    const totalAdherenceScores = await prisma.adherenceScore.count();
    const totalRiskScores = await prisma.patientRiskScore.count();
    const totalInsights = await prisma.predictiveInsight.count();
    const totalEngagement = await prisma.caregiverEngagement.count();

    console.log(`   👥 Patients: ${totalPatients}`);
    console.log(`   🤝 Caregivers: ${totalCaregivers}`);
    console.log(`   👨‍⚕️ Providers: ${totalProviders}`);
    console.log(`   📈 Adherence Scores: ${totalAdherenceScores}`);
    console.log(`   ⚠️  Risk Assessments: ${totalRiskScores}`);
    console.log(`   🔮 Predictive Insights: ${totalInsights}`);
    console.log(`   💪 Caregiver Engagement Records: ${totalEngagement}`);
    console.log(`   🩺 Health Metrics: ${await prisma.healthMetric.count()}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedFullDatabase();
