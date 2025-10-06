import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMedications() {
  console.log('🏥 Seeding medications...');

  // Create medications
  const lipitor = await prisma.medication.create({
    data: {
      name: 'Lipitor',
      genericName: 'Atorvastatin',
      brandName: 'Lipitor',
      ndc: '0071015523',
      dosage: '20mg',
      form: 'tablet',
      manufacturer: 'Pfizer',
      category: 'statin',
      description: 'Used to lower cholesterol and triglycerides in the blood.',
      sideEffects: JSON.stringify(['Muscle pain', 'Digestive issues', 'Headache']),
      warnings: JSON.stringify(['Avoid grapefruit', 'May cause liver problems', 'Muscle weakness']),
      instructions: 'Take once daily at bedtime',
      requiresPrescription: true,
      averagePrice: 45.99,
      insuranceCovered: true,
    },
  });

  const atorvastatin = await prisma.medication.create({
    data: {
      name: 'Atorvastatin',
      genericName: 'Atorvastatin',
      brandName: 'Generic',
      ndc: '0093512056',
      dosage: '20mg',
      form: 'tablet',
      manufacturer: 'Teva',
      category: 'statin',
      description: 'Generic equivalent of Lipitor. Used to lower cholesterol.',
      sideEffects: JSON.stringify(['Muscle pain', 'Digestive issues', 'Headache']),
      warnings: JSON.stringify(['Avoid grapefruit', 'May cause liver problems']),
      instructions: 'Take once daily at bedtime',
      requiresPrescription: true,
      averagePrice: 12.99,
      insuranceCovered: true,
    },
  });

  const crestor = await prisma.medication.create({
    data: {
      name: 'Crestor',
      genericName: 'Rosuvastatin',
      brandName: 'Crestor',
      ndc: '0310070090',
      dosage: '10mg',
      form: 'tablet',
      manufacturer: 'AstraZeneca',
      category: 'statin',
      description: 'Another statin medication used to lower cholesterol.',
      sideEffects: JSON.stringify(['Muscle pain', 'Headache', 'Nausea']),
      warnings: JSON.stringify(['Avoid grapefruit', 'Monitor liver function']),
      instructions: 'Take once daily',
      requiresPrescription: true,
      averagePrice: 52.99,
      insuranceCovered: true,
    },
  });

  const metformin = await prisma.medication.create({
    data: {
      name: 'Metformin',
      genericName: 'Metformin',
      brandName: 'Glucophage',
      ndc: '0093704701',
      dosage: '500mg',
      form: 'tablet',
      manufacturer: 'Bristol-Myers Squibb',
      category: 'antidiabetic',
      description: 'Used to treat type 2 diabetes.',
      sideEffects: JSON.stringify(['Nausea', 'Diarrhea', 'Stomach upset']),
      warnings: JSON.stringify(['Take with food', 'Monitor kidney function', 'Risk of lactic acidosis']),
      instructions: 'Take twice daily with meals',
      requiresPrescription: true,
      averagePrice: 8.99,
      insuranceCovered: true,
    },
  });

  const lisinopril = await prisma.medication.create({
    data: {
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      brandName: 'Prinivil',
      ndc: '0093312801',
      dosage: '10mg',
      form: 'tablet',
      manufacturer: 'Lupin',
      category: 'antihypertensive',
      description: 'Used to treat high blood pressure.',
      sideEffects: JSON.stringify(['Dizziness', 'Dry cough', 'Headache']),
      warnings: JSON.stringify(['May cause dizziness', 'Avoid potassium supplements', 'Not for pregnant women']),
      instructions: 'Take once daily in the morning',
      requiresPrescription: true,
      averagePrice: 6.99,
      insuranceCovered: true,
    },
  });

  const warfarin = await prisma.medication.create({
    data: {
      name: 'Warfarin',
      genericName: 'Warfarin',
      brandName: 'Coumadin',
      ndc: '0056017575',
      dosage: '5mg',
      form: 'tablet',
      manufacturer: 'Bristol-Myers Squibb',
      category: 'anticoagulant',
      description: 'Blood thinner to prevent clots.',
      sideEffects: JSON.stringify(['Easy bruising', 'Bleeding', 'Hair loss']),
      warnings: JSON.stringify(['Regular blood tests required', 'Avoid vitamin K rich foods', 'Bleeding risk']),
      instructions: 'Take once daily at the same time',
      requiresPrescription: true,
      controlledSubstance: 'Requires monitoring',
      averagePrice: 15.99,
      insuranceCovered: true,
    },
  });

  const amoxicillin = await prisma.medication.create({
    data: {
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      brandName: 'Amoxil',
      ndc: '0093410573',
      dosage: '250mg',
      form: 'capsule',
      manufacturer: 'Teva',
      category: 'antibiotic',
      description: 'Antibiotic for bacterial infections.',
      sideEffects: JSON.stringify(['Nausea', 'Diarrhea', 'Rash']),
      warnings: JSON.stringify(['Complete full course', 'Allergic reactions possible', 'May reduce birth control effectiveness']),
      instructions: 'Take every 8 hours with or without food',
      requiresPrescription: true,
      averagePrice: 9.99,
      insuranceCovered: true,
    },
  });

  console.log('✅ Created 7 medications');

  // Create alternatives
  await prisma.medicationAlternative.create({
    data: {
      medicationId: lipitor.id,
      alternativeId: atorvastatin.id,
      type: 'generic',
      costDifference: -33.00,
      effectiveness: 'equivalent',
      approvedBy: 'FDA',
      notes: 'Generic equivalent - same active ingredient',
    },
  });

  await prisma.medicationAlternative.create({
    data: {
      medicationId: lipitor.id,
      alternativeId: crestor.id,
      type: 'therapeutic',
      costDifference: 7.00,
      effectiveness: 'similar',
      approvedBy: 'FDA',
      notes: 'Different statin - similar effectiveness',
    },
  });

  console.log('✅ Created medication alternatives');

  // Create drug interactions
  await prisma.drugInteraction.create({
    data: {
      medication1Id: lipitor.id,
      medication2Id: warfarin.id,
      severity: 'moderate',
      description: 'Statins may increase the anticoagulant effect of warfarin',
      recommendation: 'Monitor INR levels more frequently when starting or stopping statin therapy',
      source: 'FDA Drug Interaction Database',
    },
  });

  await prisma.drugInteraction.create({
    data: {
      medication1Id: atorvastatin.id,
      medication2Id: warfarin.id,
      severity: 'moderate',
      description: 'Statins may increase the anticoagulant effect of warfarin',
      recommendation: 'Monitor INR levels more frequently',
      source: 'FDA Drug Interaction Database',
    },
  });

  console.log('✅ Created drug interactions');

  // Create prescriptions for test patient
  const testPatientId = 'b805ec90-e553-4de7-9de0-45f2eb73d1ba'; // Abdeen White
  const testProviderId = '550e8400-e29b-41d4-a716-446655440000'; // Dr. Sarah Johnson

  const prescriptions = [
    {
      patientId: testPatientId,
      providerId: testProviderId,
      medicationId: lisinopril.id,
      dosage: '10mg',
      frequency: 'daily',
      duration: 90,
      quantity: 90,
      startDate: new Date('2024-10-01'),
      refillsAllowed: 3,
      refillsRemaining: 3,
      status: 'active',
      instructions: 'Take one tablet in the morning',
      pharmacyName: 'CVS Pharmacy',
      pharmacyPhone: '555-0123',
      pharmacyAddress: '123 Main St, City, State 12345',
    },
    {
      patientId: testPatientId,
      providerId: testProviderId,
      medicationId: metformin.id,
      dosage: '500mg',
      frequency: 'twice daily',
      duration: 90,
      quantity: 180,
      startDate: new Date('2024-10-01'),
      refillsAllowed: 3,
      refillsRemaining: 3,
      status: 'active',
      instructions: 'Take one tablet with breakfast and dinner',
      pharmacyName: 'CVS Pharmacy',
      pharmacyPhone: '555-0123',
      pharmacyAddress: '123 Main St, City, State 12345',
    },
    {
      patientId: testPatientId,
      providerId: testProviderId,
      medicationId: atorvastatin.id,
      dosage: '20mg',
      frequency: 'daily',
      duration: 90,
      quantity: 90,
      startDate: new Date('2024-10-01'),
      refillsAllowed: 3,
      refillsRemaining: 3,
      status: 'active',
      instructions: 'Take one tablet at bedtime',
      pharmacyName: 'CVS Pharmacy',
      pharmacyPhone: '555-0123',
      pharmacyAddress: '123 Main St, City, State 12345',
    },
    {
      patientId: testPatientId,
      providerId: testProviderId,
      medicationId: warfarin.id,
      dosage: '5mg',
      frequency: 'daily',
      duration: 90,
      quantity: 90,
      startDate: new Date('2024-09-15'),
      refillsAllowed: 2,
      refillsRemaining: 1,
      status: 'active',
      instructions: 'Take one tablet in the evening. Regular INR monitoring required.',
      pharmacyName: 'Walgreens',
      pharmacyPhone: '555-0456',
      pharmacyAddress: '456 Oak Ave, City, State 12345',
    },
    {
      patientId: testPatientId,
      providerId: testProviderId,
      medicationId: amoxicillin.id,
      dosage: '250mg',
      frequency: 'every 8 hours',
      duration: 10,
      quantity: 30,
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-30'),
      refillsAllowed: 0,
      refillsRemaining: 0,
      status: 'active',
      instructions: 'Take every 8 hours for 10 days. Complete full course.',
      pharmacyName: 'CVS Pharmacy',
      pharmacyPhone: '555-0123',
      pharmacyAddress: '123 Main St, City, State 12345',
    },
  ];

  for (const prescriptionData of prescriptions) {
    const prescription = await prisma.prescription.create({
      data: prescriptionData,
    });

    // Create stock entry
    await prisma.medicationStock.create({
      data: {
        patientId: testPatientId,
        medicationId: prescriptionData.medicationId,
        prescriptionId: prescription.id,
        currentStock: prescriptionData.medicationId === amoxicillin.id ? 4 : 
                      prescriptionData.medicationId === warfarin.id ? 10 :
                      prescriptionData.medicationId === lisinopril.id ? 25 :
                      prescriptionData.medicationId === metformin.id ? 60 : 30,
        lowStockThreshold: 5,
        lastRefillDate: prescriptionData.startDate,
        pharmacyName: prescriptionData.pharmacyName,
        pharmacyPhone: prescriptionData.pharmacyPhone,
        pharmacyAddress: prescriptionData.pharmacyAddress,
      },
    });
  }

  console.log('✅ Created 5 prescriptions and stock entries');

  // Create some medication history
  const histories = [
    {
      patientId: testPatientId,
      medicationId: lisinopril.id,
      action: 'taken',
      timestamp: new Date('2024-12-25T08:00:00'),
      dosageTaken: '10mg',
      recordedBy: testPatientId,
    },
    {
      patientId: testPatientId,
      medicationId: metformin.id,
      action: 'taken',
      timestamp: new Date('2024-12-25T08:00:00'),
      dosageTaken: '500mg',
      recordedBy: testPatientId,
    },
    {
      patientId: testPatientId,
      medicationId: metformin.id,
      action: 'taken',
      timestamp: new Date('2024-12-25T18:00:00'),
      dosageTaken: '500mg',
      recordedBy: testPatientId,
    },
    {
      patientId: testPatientId,
      medicationId: atorvastatin.id,
      action: 'missed',
      timestamp: new Date('2024-12-24T22:00:00'),
      recordedBy: 'system',
    },
  ];

  for (const history of histories) {
    await prisma.medicationHistory.create({
      data: history,
    });
  }

  console.log('✅ Created medication history');

  console.log('🎉 Medication seeding complete!');
  console.log('📊 Summary:');
  console.log('  - 7 medications created');
  console.log('  - 2 alternative relationships');
  console.log('  - 2 drug interactions');
  console.log('  - 5 active prescriptions for Abdeen White');
  console.log('  - Stock levels: Amoxicillin (4 - LOW), Warfarin (10), Lisinopril (25), Metformin (60), Atorvastatin (30)');
}

seedMedications()
  .catch((e) => {
    console.error('Error seeding medications:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
