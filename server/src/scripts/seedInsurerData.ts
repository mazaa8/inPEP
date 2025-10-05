import prisma from '../config/database.js';

async function seedInsurerData() {
  console.log('🌱 Seeding insurer data...');

  // Get patient and providers
  const patient = await prisma.user.findUnique({
    where: { email: 'patient@test.com' },
  });

  const providers = await prisma.user.findMany({
    where: { role: 'PROVIDER', isActive: true },
    take: 5,
  });

  if (!patient || providers.length === 0) {
    console.error('❌ Patient or providers not found');
    return;
  }

  console.log(`✅ Found patient: ${patient.name}`);
  console.log(`✅ Found ${providers.length} providers`);

  // Generate claims
  const claims = [];
  const claimTypes = ['MEDICAL', 'PHARMACY', 'DENTAL', 'VISION'];
  const statuses = ['APPROVED', 'PENDING', 'DENIED', 'UNDER_REVIEW'];
  
  for (let i = 0; i < 50; i++) {
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const claimType = claimTypes[Math.floor(Math.random() * claimTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const claimedAmount = Math.random() * 5000 + 500; // $500-$5500
    const approvedAmount = status === 'APPROVED' 
      ? claimedAmount * (0.8 + Math.random() * 0.2) // 80-100% of claimed
      : status === 'DENIED' ? 0 : null;
    
    const serviceDate = new Date();
    serviceDate.setDate(serviceDate.getDate() - Math.floor(Math.random() * 90));
    
    claims.push({
      patientId: patient.id,
      patientName: patient.name,
      providerId: provider.id,
      providerName: provider.name,
      claimNumber: `CLM-2025-${String(10000 + i).padStart(5, '0')}`,
      claimType,
      serviceDate,
      claimedAmount,
      approvedAmount,
      deductible: Math.random() * 500,
      copay: Math.random() * 50,
      status,
      denialReason: status === 'DENIED' ? 'Service not covered under plan' : null,
      diagnosisCode: `ICD-${Math.floor(Math.random() * 1000)}`,
      procedureCode: `CPT-${Math.floor(Math.random() * 10000)}`,
      description: `${claimType} service - ${provider.name}`,
      isHighCost: claimedAmount > 3000,
      isFraudSuspect: Math.random() < 0.05, // 5% flagged for review
      riskScore: Math.random() * 100,
      processedDate: status === 'APPROVED' || status === 'DENIED' ? new Date() : null,
    });
  }

  console.log('💰 Creating claims...');
  await prisma.claim.createMany({ data: claims });
  console.log(`✅ Created ${claims.length} claims`);

  // Generate risk assessment for patient
  const chronicConditions = ['Heart Disease', 'Chronic Pancreatitis', 'Hypertension'];
  
  const riskAssessment = {
    patientId: patient.id,
    patientName: patient.name,
    overallRiskScore: 75.5,
    riskLevel: 'HIGH',
    chronicConditions: JSON.stringify(chronicConditions),
    recentHospitalizations: 1,
    medicationCount: 4,
    missedAppointments: 2,
    hospitalizationRisk: 68.0,
    costPrediction: 45000, // $45k annual cost prediction
    interventions: JSON.stringify([
      'Schedule quarterly cardiology check-ups',
      'Enroll in diabetes management program',
      'Medication adherence monitoring',
      'Nutritional counseling recommended',
    ]),
    nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  };

  console.log('🎯 Creating risk assessment...');
  await prisma.riskAssessment.create({ data: riskAssessment });
  console.log('✅ Created risk assessment for Abdeen White');

  // Generate a few more low-risk assessments
  const lowRiskPatients = [
    { name: 'Jan Graham', score: 25, level: 'LOW' },
    { name: 'Steven Cameron', score: 35, level: 'LOW' },
    { name: 'Michelle Coleman', score: 45, level: 'MEDIUM' },
    { name: 'Victoria Black', score: 55, level: 'MEDIUM' },
    { name: 'Liam Randall', score: 82, level: 'HIGH' },
  ];

  for (const p of lowRiskPatients) {
    await prisma.riskAssessment.create({
      data: {
        patientId: `mock-${p.name.replace(' ', '-').toLowerCase()}`,
        patientName: p.name,
        overallRiskScore: p.score,
        riskLevel: p.level,
        chronicConditions: JSON.stringify(['Hypertension']),
        recentHospitalizations: 0,
        medicationCount: 2,
        missedAppointments: 0,
        hospitalizationRisk: p.score * 0.8,
        costPrediction: p.score * 500,
        interventions: JSON.stringify(['Annual wellness visit']),
      },
    });
  }

  console.log(`✅ Created ${lowRiskPatients.length} additional risk assessments`);

  console.log('\n🎉 Insurer data seeding complete!');
  console.log('\n📊 Summary:');
  console.log(`   - ${claims.length} claims`);
  console.log(`   - ${lowRiskPatients.length + 1} risk assessments`);
  console.log(`   - Total claimed: $${claims.reduce((sum, c) => sum + c.claimedAmount, 0).toFixed(2)}`);
  console.log(`   - High-risk patients: ${lowRiskPatients.filter(p => p.level === 'HIGH').length + 1}`);
}

seedInsurerData()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
