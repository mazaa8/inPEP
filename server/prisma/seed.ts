import { seedCaregiverEngagement } from './seeds/caregiverEngagement';
import { seedConversations } from './seeds/conversations';

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await seedCaregiverEngagement();
  await seedConversations();

  console.log('\n✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$disconnect();
  });
