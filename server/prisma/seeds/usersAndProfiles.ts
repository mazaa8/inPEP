import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedUsersAndProfiles() {
  console.log('👤 Seeding users and profiles...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Clear existing users to avoid conflicts
  await prisma.user.deleteMany({});

  // --- Create Test Patient ---
  const patientUser = await prisma.user.create({
    data: {
      id: 'b805ec90-e553-4de7-9de0-45f2eb73d1ba', // Static ID for consistency
      email: 'patient@test.com',
      name: 'Abdeen White',
      passwordHash: hashedPassword,
      role: 'PATIENT',
      patientProfile: {
        create: {},
      },
    },
  });
  console.log(`  ✅ Created Patient: ${patientUser.name}`);

  // --- Create Test Caregiver ---
  const caregiverUser = await prisma.user.create({
    data: {
      id: '00a17435-af59-472e-83db-ec6a39db673a', // Static ID
      email: 'caregiver@test.com',
      name: 'Angela Hall',
      passwordHash: hashedPassword,
      role: 'CAREGIVER',
      caregiverProfile: {
        create: {},
      },
    },
  });
  console.log(`  ✅ Created Caregiver: ${caregiverUser.name}`);

  // --- Create Test Provider ---
  const providerUser = await prisma.user.create({
    data: {
      id: '2a2b6a9c-6bde-41f0-b722-4d0102238b1f', // Static ID
      email: 'provider@test.com',
      name: 'Test Provider',
      passwordHash: hashedPassword,
      role: 'PROVIDER',
      providerProfile: {
        create: {
          licenseNumber: 'PN12345',
        },
      },
    },
  });
  console.log(`  ✅ Created Provider: ${providerUser.name}`);

  console.log('✅ Users and profiles seeding completed!');
}
