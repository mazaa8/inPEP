import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

async function seedEMRData() {
  try {
    console.log('🌱 Seeding EMR data...');

    // Get the first provider
    const provider = await prisma.providerProfile.findFirst({
      include: { user: true },
    });

    if (!provider) {
      console.log('❌ No provider found. Please create a provider first.');
      return;
    }

    console.log(`✅ Found provider: ${provider.user.name}`);

    // Create 5 test patients with EMR data
    const patientData = [
      {
        name: 'Abdeen White',
        email: 'abdeen.white@patient.com',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Peanuts'],
        chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@patient.com',
        bloodType: 'A+',
        allergies: ['Latex'],
        chronicConditions: ['Asthma'],
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@patient.com',
        bloodType: 'B-',
        allergies: [],
        chronicConditions: ['Chronic Heart Disease'],
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@patient.com',
        bloodType: 'AB+',
        allergies: ['Sulfa drugs'],
        chronicConditions: ['Arthritis', 'High Cholesterol'],
      },
      {
        name: 'David Thompson',
        email: 'david.thompson@patient.com',
        bloodType: 'O-',
        allergies: ['Aspirin', 'Iodine'],
        chronicConditions: ['COPD'],
      },
    ];

    for (const patient of patientData) {
      // Check if patient already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: patient.email },
      });

      if (existingUser) {
        console.log(`⏭️  Patient ${patient.name} already exists, skipping...`);
        continue;
      }

      // Create user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          email: patient.email,
          passwordHash: hashedPassword,
          name: patient.name,
          role: 'PATIENT',
          dateOfBirth: new Date(1960 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          phoneNumber: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          address: `${Math.floor(Math.random() * 9000) + 1000} Main St, City, State ${Math.floor(Math.random() * 90000) + 10000}`,
        },
      });

      // Create patient profile
      await prisma.patientProfile.create({
        data: {
          userId: user.id,
          medicalRecordNumber: `MRN-${user.id.substring(0, 8).toUpperCase()}`,
          bloodType: patient.bloodType,
          allergies: JSON.stringify(patient.allergies),
          chronicConditions: JSON.stringify(patient.chronicConditions),
          emergencyContact: `Emergency Contact: +1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          primaryProviderId: provider.userId,
        },
      });

      // Create some health metrics
      await prisma.healthMetric.createMany({
        data: [
          {
            patientId: user.id,
            metricType: 'BLOOD_PRESSURE',
            value: 120 + Math.floor(Math.random() * 20),
            unit: 'mmHg',
            source: 'EMR_SYNC',
            recordedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
          },
          {
            patientId: user.id,
            metricType: 'HEART_RATE',
            value: 70 + Math.floor(Math.random() * 20),
            unit: 'bpm',
            source: 'EMR_SYNC',
            recordedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
          },
          {
            patientId: user.id,
            metricType: 'WEIGHT',
            value: 150 + Math.floor(Math.random() * 50),
            unit: 'lbs',
            source: 'EMR_SYNC',
            recordedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
          },
        ],
      });

      // Create an appointment
      await prisma.appointment.create({
        data: {
          patientId: user.id,
          patientName: user.name,
          providerId: provider.userId,
          providerName: provider.user.name,
          title: 'Follow-up Consultation',
          appointmentType: 'Follow-up',
          startTime: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          duration: 30,
          status: 'SCHEDULED',
          createdBy: provider.userId,
        },
      });

      console.log(`✅ Created patient: ${patient.name}`);
    }

    console.log('🎉 EMR data seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding EMR data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEMRData();
