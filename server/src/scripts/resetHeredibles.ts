import prisma from '../config/database.js';

async function resetHeredibles() {
  console.log('🔄 Resetting Heredibles data...');

  try {
    // Delete in correct order (foreign key constraints)
    await prisma.plannedMeal.deleteMany({});
    console.log('✅ Deleted planned meals');

    await prisma.nutritionLog.deleteMany({});
    console.log('✅ Deleted nutrition logs');

    await prisma.mealPlan.deleteMany({});
    console.log('✅ Deleted meal plans');

    await prisma.recipe.deleteMany({});
    console.log('✅ Deleted recipes');

    console.log('\n🎉 Heredibles data reset complete!');
    console.log('Run: npm run seed:heredibles to add new data');
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

resetHeredibles()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
