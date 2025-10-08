import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const relationships = ['Daughter', 'Son', 'Spouse', 'Professional Caregiver', 'Sibling', 'Parent'];
const firstNames = ['Nora', 'James', 'Sarah', 'Michael', 'Emily', 'David', 'Lisa', 'Robert', 'Maria', 'John'];
const lastNames = ['White', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

export async function seedCaregiverEngagement() {
  console.log('🌱 Seeding Caregiver Engagement data...');

  // Get all patient profiles to map caregivers to patients
  const patientProfiles = await prisma.patientProfile.findMany({
    include: {
      user: true,
    },
    take: 101,
  });

  if (patientProfiles.length === 0) {
    console.log('⚠️  No patient profiles found. Please seed patients first.');
    return;
  }

  const caregiverEngagementData = [];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of current week

  // First entry: Nora White caring for Abdeen White
  const abdeen = patientProfiles.find(p => p.user.name?.includes('Abdeen'));
  if (abdeen) {
    caregiverEngagementData.push({
      caregiverId: abdeen.caregiverId || `caregiver-${abdeen.id}`,
      caregiverName: 'Nora White',
      patientId: abdeen.userId,
      patientName: abdeen.user.name || 'Abdeen White',
      engagementScore: 92,
      engagementLevel: 'high',
      wellnessPlanUpdates: 8,
      medicationLogs: 28,
      mealPlanUpdates: 21,
      vitalsRecorded: 14,
      messagesExchanged: 45,
      stressLevel: 'low',
      burnoutRisk: 15,
      lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastActivityType: 'Medication Log',
      weekStart,
    });
  }

  // Generate remaining caregiver engagement records
  for (let i = 1; i < Math.min(patientProfiles.length, 101); i++) {
    const patient = patientProfiles[i];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Varied engagement scores
    let engagementScore;
    let engagementLevel;
    let burnoutRisk;
    let stressLevel;
    
    if (i <= 45) { // 45 highly engaged
      engagementScore = Math.floor(Math.random() * 20) + 80; // 80-100
      engagementLevel = 'high';
      burnoutRisk = Math.floor(Math.random() * 30); // 0-30
      stressLevel = 'low';
    } else if (i <= 85) { // 40 moderately engaged
      engagementScore = Math.floor(Math.random() * 30) + 50; // 50-80
      engagementLevel = 'moderate';
      burnoutRisk = Math.floor(Math.random() * 40) + 20; // 20-60
      stressLevel = Math.random() > 0.5 ? 'moderate' : 'low';
    } else { // 16 low engagement
      engagementScore = Math.floor(Math.random() * 30) + 20; // 20-50
      engagementLevel = 'low';
      burnoutRisk = Math.floor(Math.random() * 40) + 60; // 60-100
      stressLevel = Math.random() > 0.5 ? 'high' : 'moderate';
    }

    const hoursAgo = Math.floor(Math.random() * 72) + 1;
    const lastActivityAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    
    const activityTypes = ['Medication Log', 'Meal Update', 'Vitals Recording', 'Message', 'Wellness Plan Update'];
    const lastActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];

    caregiverEngagementData.push({
      caregiverId: patient.caregiverId || `caregiver-${patient.id}`,
      caregiverName: `${firstName} ${lastName}`,
      patientId: patient.userId,
      patientName: patient.user.name || `Patient ${i}`,
      engagementScore,
      engagementLevel,
      wellnessPlanUpdates: Math.floor(Math.random() * 10),
      medicationLogs: Math.floor(Math.random() * 30),
      mealPlanUpdates: Math.floor(Math.random() * 25),
      vitalsRecorded: Math.floor(Math.random() * 20),
      messagesExchanged: Math.floor(Math.random() * 50),
      stressLevel,
      burnoutRisk,
      lastActivityAt,
      lastActivityType,
      weekStart,
    });
  }

  // Delete existing caregiver engagement data
  await prisma.caregiverEngagement.deleteMany({});
  console.log('🗑️  Cleared existing caregiver engagement data');

  // Insert new data
  const result = await prisma.caregiverEngagement.createMany({
    data: caregiverEngagementData,
  });

  console.log(`✅ Seeded ${result.count} caregiver engagement records`);
  console.log(`   - Highly Engaged: ${caregiverEngagementData.filter(c => c.engagementLevel === 'high').length}`);
  console.log(`   - Moderately Engaged: ${caregiverEngagementData.filter(c => c.engagementLevel === 'moderate').length}`);
  console.log(`   - Low Engagement: ${caregiverEngagementData.filter(c => c.engagementLevel === 'low').length}`);
}

// Run if called directly
seedCaregiverEngagement()
  .catch((e) => {
    console.error('❌ Error seeding caregiver engagement:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
