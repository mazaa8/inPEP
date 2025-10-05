import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';

const providers = [
  {
    firstName: 'Claire',
    lastName: 'MacLeod',
    email: 'claire.macleod@inpep.com',
    specialty: 'Cardiology',
    role: 'Cardiologist',
    department: 'Cardiovascular Medicine',
    licenseNumber: 'MD-2024-001',
  },
  {
    firstName: 'Hannah',
    lastName: 'Randall',
    email: 'hannah.randall@inpep.com',
    specialty: 'Pediatrics',
    role: 'Pediatrician',
    department: 'Children\'s Health',
    licenseNumber: 'MD-2024-002',
  },
  {
    firstName: 'Neil',
    lastName: 'Rampling',
    email: 'neil.rampling@inpep.com',
    specialty: 'Orthopedics',
    role: 'Orthopedic Surgeon',
    department: 'Orthopedic Surgery',
    licenseNumber: 'MD-2024-003',
  },
  {
    firstName: 'Gabrielle',
    lastName: 'Cameron',
    email: 'gabrielle.cameron@inpep.com',
    specialty: 'Dermatology',
    role: 'Dermatologist',
    department: 'Skin & Aesthetic Medicine',
    licenseNumber: 'MD-2024-004',
  },
  {
    firstName: 'Thomas',
    lastName: 'Gray',
    email: 'thomas.gray@inpep.com',
    specialty: 'Neurology',
    role: 'Neurologist',
    department: 'Neuroscience Center',
    licenseNumber: 'MD-2024-005',
  },
  {
    firstName: 'Kevin',
    lastName: 'MacLeod',
    email: 'kevin.macleod@inpep.com',
    specialty: 'General Practice',
    role: 'General Practitioner',
    department: 'Family Medicine',
    licenseNumber: 'MD-2024-006',
  },
  {
    firstName: 'Donna',
    lastName: 'McLean',
    email: 'donna.mclean@inpep.com',
    specialty: 'Obstetrics & Gynecology',
    role: 'OB/GYN',
    department: 'Women\'s Health',
    licenseNumber: 'MD-2024-007',
  },
  {
    firstName: 'Sarah',
    lastName: 'Taylor',
    email: 'sarah.taylor@inpep.com',
    specialty: 'Psychiatry',
    role: 'Psychiatrist',
    department: 'Mental Health Services',
    licenseNumber: 'MD-2024-008',
  },
  {
    firstName: 'Alexandra',
    lastName: 'Hodges',
    email: 'alexandra.hodges@inpep.com',
    specialty: 'Oncology',
    role: 'Oncologist',
    department: 'Cancer Treatment Center',
    licenseNumber: 'MD-2024-009',
  },
  {
    firstName: 'Madeleine',
    lastName: 'Lawrence',
    email: 'madeleine.lawrence@inpep.com',
    specialty: 'Endocrinology',
    role: 'Endocrinologist',
    department: 'Diabetes & Hormone Center',
    licenseNumber: 'MD-2024-010',
  },
  {
    firstName: 'Vanessa',
    lastName: 'Hardacre',
    email: 'vanessa.hardacre@inpep.com',
    specialty: 'Radiology',
    role: 'Radiologist',
    department: 'Diagnostic Imaging',
    licenseNumber: 'MD-2024-011',
  },
  {
    firstName: 'Nicholas',
    lastName: 'Churchill',
    email: 'nicholas.churchill@inpep.com',
    specialty: 'Gastroenterology',
    role: 'Gastroenterologist',
    department: 'Digestive Health',
    licenseNumber: 'MD-2024-012',
  },
  {
    firstName: 'Katherine',
    lastName: 'Fisher',
    email: 'katherine.fisher@inpep.com',
    specialty: 'Emergency Medicine',
    role: 'Emergency Physician',
    department: 'Emergency Department',
    licenseNumber: 'MD-2024-013',
  },
  {
    firstName: 'Michael',
    lastName: 'Howard',
    email: 'michael.howard@inpep.com',
    specialty: 'Anesthesiology',
    role: 'Anesthesiologist',
    department: 'Surgical Services',
    licenseNumber: 'MD-2024-014',
  },
  {
    firstName: 'Harry',
    lastName: 'Manning',
    email: 'harry.manning@inpep.com',
    specialty: 'Urology',
    role: 'Urologist',
    department: 'Urology Center',
    licenseNumber: 'MD-2024-015',
  },
  {
    firstName: 'Anne',
    lastName: 'McGrath',
    email: 'anne.mcgrath@inpep.com',
    specialty: 'Pulmonology',
    role: 'Pulmonologist',
    department: 'Respiratory Medicine',
    licenseNumber: 'MD-2024-016',
  },
  {
    firstName: 'Max',
    lastName: 'Ross',
    email: 'max.ross@inpep.com',
    specialty: 'Ophthalmology',
    role: 'Ophthalmologist',
    department: 'Eye Care Center',
    licenseNumber: 'MD-2024-017',
  },
  {
    firstName: 'Anne',
    lastName: 'Ellison',
    email: 'anne.ellison@inpep.com',
    specialty: 'Rheumatology',
    role: 'Rheumatologist',
    department: 'Arthritis & Autoimmune Center',
    licenseNumber: 'MD-2024-018',
  },
  {
    firstName: 'Kylie',
    lastName: 'Forsyth',
    email: 'kylie.forsyth@inpep.com',
    specialty: 'Physical Therapy',
    role: 'Physical Therapist',
    department: 'Rehabilitation Services',
    licenseNumber: 'PT-2024-019',
  },
  {
    firstName: 'Zoe',
    lastName: 'Robertson',
    email: 'zoe.robertson@inpep.com',
    specialty: 'Pharmacy',
    role: 'Clinical Pharmacist',
    department: 'Pharmacy Services',
    licenseNumber: 'RPH-2024-020',
  },
];

async function seedProviders() {
  console.log('🌱 Seeding provider profiles...');

  const password = 'password123'; // Same password for all test accounts
  const hashedPassword = await bcrypt.hash(password, 10);

  let successCount = 0;
  let skipCount = 0;

  for (const provider of providers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: provider.email },
      });

      if (existingUser) {
        console.log(`⏭️  Skipping ${provider.firstName} ${provider.lastName} - already exists`);
        skipCount++;
        continue;
      }

      // Create user account
      const user = await prisma.user.create({
        data: {
          email: provider.email,
          passwordHash: hashedPassword,
          name: `Dr. ${provider.firstName} ${provider.lastName}`,
          role: 'PROVIDER',
        },
      });

      // Create provider profile
      await prisma.providerProfile.create({
        data: {
          userId: user.id,
          specialty: provider.specialty,
          licenseNumber: provider.licenseNumber,
          npiNumber: `NPI-${Math.floor(Math.random() * 1000000000)}`,
          clinicName: 'inPEP Medical Center',
          clinicAddress: '123 Healthcare Blvd, Medical District',
        },
      });

      console.log(`✅ Created: Dr. ${provider.firstName} ${provider.lastName} - ${provider.specialty}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create ${provider.firstName} ${provider.lastName}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${successCount} providers`);
  console.log(`   ⏭️  Skipped: ${skipCount} providers (already exist)`);
  console.log(`   📧 All providers can login with: password123`);
  console.log(`\n🎉 Seeding complete!`);
}

// Run the seed function
seedProviders()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
