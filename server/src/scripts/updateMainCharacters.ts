import prisma from '../config/database.js';

async function updateMainCharacters() {
  console.log('🔄 Updating main characters...');

  try {
    // Update patient name
    const patient = await prisma.user.update({
      where: { email: 'patient@test.com' },
      data: { name: 'Abdeen White' },
    });
    console.log('✅ Updated patient:', patient.name);

    // Update caregiver name
    const caregiver = await prisma.user.update({
      where: { email: 'caregiver@test.com' },
      data: { name: 'Nora White' },
    });
    console.log('✅ Updated caregiver:', caregiver.name);

    // Update all appointments to use new names
    await prisma.appointment.updateMany({
      where: { patientId: patient.id },
      data: { patientName: 'Abdeen White' },
    });
    console.log('✅ Updated appointment patient names');

    console.log('\n🎉 Main characters updated successfully!');
    console.log('   Patient: Abdeen White (patient@test.com)');
    console.log('   Caregiver: Nora White (caregiver@test.com)');
  } catch (error) {
    console.error('❌ Update failed:', error);
  }
}

updateMainCharacters()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
