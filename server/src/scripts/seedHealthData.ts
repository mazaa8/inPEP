import prisma from '../config/database.js';

// Generate sample health data for test patient
async function seedHealthData() {
  console.log('🌱 Seeding health data...');

  const patientEmail = 'patient@test.com';
  
  // Find patient
  const patient = await prisma.user.findUnique({
    where: { email: patientEmail },
  });

  if (!patient) {
    console.error('❌ Patient not found');
    return;
  }

  console.log(`✅ Found patient: ${patient.name}`);

  // Generate blood pressure readings (last 30 days)
  const bpReadings = [];
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate improving BP trend
    const systolic = 145 - (i * 0.5) + (Math.random() * 5);
    const diastolic = 92 - (i * 0.3) + (Math.random() * 3);
    
    bpReadings.push({
      patientId: patient.id,
      metricType: 'BLOOD_PRESSURE',
      value: systolic,
      unit: 'mmHg',
      additionalData: JSON.stringify({ systolic: Math.round(systolic), diastolic: Math.round(diastolic) }),
      recordedAt: date,
      source: 'MANUAL',
    });
  }

  // Generate heart rate readings
  const hrReadings = [];
  for (let i = 20; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const heartRate = 72 + (Math.random() * 10 - 5);
    
    hrReadings.push({
      patientId: patient.id,
      metricType: 'HEART_RATE',
      value: Math.round(heartRate),
      unit: 'bpm',
      recordedAt: date,
      source: 'DEVICE',
    });
  }

  // Generate weight readings
  const weightReadings = [];
  const startWeight = 85;
  for (let i = 60; i >= 0; i -= 3) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate stable weight
    const weight = startWeight + (Math.random() * 1 - 0.5);
    
    weightReadings.push({
      patientId: patient.id,
      metricType: 'WEIGHT',
      value: parseFloat(weight.toFixed(1)),
      unit: 'kg',
      recordedAt: date,
      source: 'MANUAL',
    });
  }

  // Generate glucose readings
  const glucoseReadings = [];
  for (let i = 14; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate well-controlled glucose
    const glucose = 95 + (Math.random() * 10 - 5);
    
    glucoseReadings.push({
      patientId: patient.id,
      metricType: 'GLUCOSE',
      value: Math.round(glucose),
      unit: 'mg/dL',
      recordedAt: date,
      source: 'DEVICE',
    });
  }

  // Insert all metrics
  console.log('📊 Creating health metrics...');
  
  await prisma.healthMetric.createMany({
    data: [...bpReadings, ...hrReadings, ...weightReadings, ...glucoseReadings],
  });

  const totalMetrics = bpReadings.length + hrReadings.length + weightReadings.length + glucoseReadings.length;
  
  console.log(`✅ Created ${totalMetrics} health metrics:`);
  console.log(`   - ${bpReadings.length} blood pressure readings`);
  console.log(`   - ${hrReadings.length} heart rate readings`);
  console.log(`   - ${weightReadings.length} weight readings`);
  console.log(`   - ${glucoseReadings.length} glucose readings`);
  
  console.log('\n🎉 Health data seeding complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Login as patient@test.com');
  console.log('   2. View Patient Dashboard');
  console.log('   3. Click "Analyze Health Data" to generate AI insights');
}

// Run the seed function
seedHealthData()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
